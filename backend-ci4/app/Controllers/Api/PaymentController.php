<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Libraries\Razorpay;
use App\Models\OrderModel;
use App\Models\EbookModel;
use App\Models\RazorpayWebhookModel;
use App\Models\SettingModel;
use Config\Payments;

class PaymentController extends BaseController
{
    private Razorpay $razorpay;

    public function __construct()
    {
        $this->razorpay = new Razorpay();
    }

    /**
     * CI4.7: respond() was removed — small JSON helper.
     */
    private function respond(array $data, int $code = 200)
    {
        return $this->response->setStatusCode($code)->setJSON($data);
    }

    /**
     * POST /api/payments/create-order
     * Creates a Razorpay order for the ebook and stores it locally (status=created).
     */
    public function createOrder()
    {
        $body = $this->jsonBody();
        $cust = is_array($body['customer_details'] ?? null) ? $body['customer_details'] : [];

        $name  = trim((string) ($cust['customer_name'] ?? ($cust['name'] ?? '')));
        $email = trim((string) ($cust['customer_email'] ?? ($cust['email'] ?? '')));
        $phone = preg_replace('/[^0-9+]/', '', (string) ($cust['customer_phone'] ?? ($cust['phone'] ?? '')));

        if ($name === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->respond(['ok' => false, 'error' => 'Valid name and email are required'], 422);
        }

        // Server-side authoritative price — managed by the admin panel (settings table).
        $amountPaise   = $this->currentPricePaise();
        $visitorId     = $this->sanitizeId($body['visitor_id'] ?? '');
        $receipt       = 'ebook_' . date('YmdHis') . '_' . bin2hex(random_bytes(3));

        try {
            $rzpOrder = $this->razorpay->createOrder($amountPaise, $receipt, [
                'customer_name'  => $name,
                'customer_email' => $email,
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Razorpay createOrder failed: ' . $e->getMessage());

            return $this->respond([
                'ok'    => false,
                'error' => 'Could not initiate payment. Please try again shortly.',
            ], 502);
        }

        $orderId = (string) ($rzpOrder['id'] ?? '');
        if ($orderId === '') {
            return $this->respond(['ok' => false, 'error' => 'Razorpay did not return an order id'], 502);
        }

        (new OrderModel())->insert([
            'razorpay_order_id' => $orderId,
            'customer_name'     => $name,
            'customer_email'    => $email,
            'customer_phone'    => $phone !== '' ? $phone : null,
            'amount'            => $amountPaise,
            'currency'          => 'INR',
            'status'            => 'created',
            'receipt'           => $receipt,
            'visitor_id'        => $visitorId !== '' ? $visitorId : null,
            'notes'             => json_encode(['source' => 'website_checkout']),
            'created_at'        => date('Y-m-d H:i:s'),
            'updated_at'        => date('Y-m-d H:i:s'),
        ]);

        return $this->respond([
            'ok'        => true,
            'order_id'  => $orderId,
            'amount'    => $amountPaise,
            'currency'  => 'INR',
            'key_id'    => $this->razorpayKeyPublic(),
        ]);
    }

    /**
     * POST /api/payments/verify
     * Called by the browser after Razorpay checkout with the signature.
     * Independently validates the HMAC signature server-side.
     */
    public function verify()
    {
        $body            = $this->jsonBody();
        $orderId         = trim((string) ($body['razorpay_order_id'] ?? ''));
        $paymentId       = trim((string) ($body['razorpay_payment_id'] ?? ''));
        $signature       = trim((string) ($body['razorpay_signature'] ?? ''));

        if ($orderId === '' || $paymentId === '' || $signature === '') {
            return $this->respond(['ok' => false, 'error' => 'Missing verification payload'], 422);
        }

        if (! $this->razorpay->verifySignature($orderId, $paymentId, $signature)) {
            // Log the fraud attempt but never trust the client.
            log_message('warning', 'Razorpay signature mismatch for order: ' . $orderId);

            return $this->respond(['ok' => false, 'error' => 'Invalid payment signature'], 400);
        }

        $orderModel = new OrderModel();
        $order      = $orderModel->where('razorpay_order_id', $orderId)->first();

        if (! $order) {
            return $this->respond(['ok' => false, 'error' => 'Order not found'], 404);
        }

        // Only mark paid once (idempotent — Razorpay checkout can re-post).
        if ($order['status'] !== 'paid') {
            $method = null;
            try {
                $payment       = $this->razorpay->fetchPayment($paymentId);
                $method        = $payment['method'] ?? null;
                $paymentStatus = $payment['status'] ?? null;

                // Extra safety: only mark paid if Razorpay itself says captured/authorized.
                if ($paymentStatus !== null && ! in_array($paymentStatus, ['captured', 'authorized'], true)) {
                    return $this->respond(['ok' => false, 'error' => 'Payment not captured yet'], 400);
                }
            } catch (\Throwable $e) {
                // If the payment lookup fails we still trust the verified signature.
                log_message('error', 'Razorpay fetchPayment failed: ' . $e->getMessage());
            }

            $orderModel->update($order['id'], [
                'razorpay_payment_id' => $paymentId,
                'signature'           => $signature,
                'status'              => 'paid',
                'method'              => $method,
                'download_token'      => $this->issueDownloadToken($orderId),
                'paid_at'             => date('Y-m-d H:i:s'),
            ]);
        }

        return $this->respond([
            'ok'            => true,
            'status'        => 'SUCCESS',
            'order_id'      => $orderId,
            'download_token'=> $order['download_token'] ?? null,
        ]);
    }

    /**
     * GET /api/payments/status?order_id=...
     * Polling endpoint for the success page.
     */
    public function status()
    {
        $orderId = $this->request->getGet('order_id') ?? '';
        $order   = (new OrderModel())->where('razorpay_order_id', trim((string) $orderId))->first();

        if (! $order) {
            return $this->respond(['ok' => false, 'error' => 'Order not found'], 404);
        }

        $status = $order['status'] === 'paid' ? 'SUCCESS'
            : ($order['status'] === 'failed' ? 'FAILED' : 'PENDING');

        // Self-heal: paid orders get a fresh download token whenever the old
        // one is missing or expired, so the download link keeps working.
        $token = $order['download_token'] ?? null;
        if ($order['status'] === 'paid' && ($token === null || $token === '' || $this->readDownloadToken($token) === null)) {
            $token = $this->issueDownloadToken($order['razorpay_order_id']);
            (new OrderModel())->update($order['id'], ['download_token' => $token]);
        }

        return $this->respond([
            'ok'             => true,
            'status'         => $status,
            'order_id'       => $order['razorpay_order_id'],
            'download_token' => $token,
        ]);
    }

    /**
     * POST /api/payments/webhook  (Razorpay calls this)
     * Webhook URL: https://YOUR-DOMAIN/api/payments/webhook
     * Events: payment.captured, payment.failed
     */
    public function webhook()
    {
        $rawBody     = (string) file_get_contents('php://input');
        $signature   = (string) ($this->request->getHeaderLine('X-Razorpay-Signature') ?? '');
        $eventId     = (string) ($this->request->getHeaderLine('X-Razorpay-Event-Id') ?? '');
        $eventType   = (string) ($this->request->getHeaderLine('X-Razorpay-Event-Id') !== ''
            ? ($this->decodeEvent($rawBody) ?? '') : '');

        $config      = config(Payments::class);
        $isValid     = $this->razorpay->verifyWebhookSignature($rawBody, $signature, $config->razorpayWebhookSecret);

        $payload = json_decode($rawBody, true) ?? [];
        $event   = $eventType !== '' ? $eventType : (string) ($payload['event'] ?? 'unknown');

        $paymentEntity = $payload['payload']['payment']['entity'] ?? [];
        $rzpOrderId    = (string) ($paymentEntity['order_id'] ?? '');
        $rzpPaymentId  = (string) ($paymentEntity['id'] ?? '');
        $paymentStatus = (string) ($paymentEntity['status'] ?? '');

        // Idempotency: Razorpay may deliver the same event multiple times.
        $webhookModel = new RazorpayWebhookModel();
        if ($eventId !== '' && $webhookModel->where('event_id', $eventId)->first()) {
            return $this->respond(['ok' => true, 'message' => 'Duplicate event ignored'], 200);
        }

        $webhookModel->insert([
            'event_id'           => $eventId !== '' ? $eventId : uniqid('wh_', true),
            'event_type'         => mb_substr($event, 0, 100),
            'razorpay_order_id'  => $rzpOrderId !== '' ? $rzpOrderId : null,
            'razorpay_payment_id'=> $rzpPaymentId !== '' ? $rzpPaymentId : null,
            'status'             => $paymentStatus !== '' ? mb_substr($paymentStatus, 0, 20) : null,
            'payload'            => mb_substr($rawBody, 0, 60000),
            'signature_valid'    => $isValid ? 1 : 0,
            'processed'          => 0,
            'created_at'         => date('Y-m-d H:i:s'),
            'updated_at'         => date('Y-m-d H:i:s'),
        ]);

        // Process only signature-valid events.
        if ($isValid && $rzpOrderId !== '') {
            $orderModel = new OrderModel();
            $order      = $orderModel->where('razorpay_order_id', $rzpOrderId)->first();

            if ($order && $order['status'] !== 'paid') {
                if ($paymentStatus === 'captured') {
                    $orderModel->update($order['id'], [
                        'razorpay_payment_id' => $rzpPaymentId !== '' ? $rzpPaymentId : $order['razorpay_payment_id'],
                        'status'              => 'paid',
                        'method'              => $paymentEntity['method'] ?? $order['method'],
                        'download_token'      => $order['download_token'] ?? $this->issueDownloadToken($rzpOrderId),
                        'paid_at'             => date('Y-m-d H:i:s'),
                    ]);
                } elseif ($paymentStatus === 'failed') {
                    $orderModel->update($order['id'], ['status' => 'failed']);
                }
            }

            // Mark webhook processed.
            $rows = $webhookModel->where('razorpay_order_id', $rzpOrderId)
                ->where('processed', 0)->findAll();
            foreach ($rows as $row) {
                $webhookModel->update($row['id'], ['processed' => 1]);
            }
        }

        // Always 200 so Razorpay stops retrying.
        return $this->respond(['ok' => true]);
    }

    /**
     * GET /api/payments/download?token=...
     * Validates the signed short-lived token and 302-redirects to the Google Drive file.
     */
    public function download()
    {
        $token = (string) $this->request->getGet('token');

        $data = $this->readDownloadToken($token);
        if (! $data) {
            return $this->respond(['ok' => false, 'error' => 'Invalid or expired download link'], 403);
        }

        // The order must actually be paid.
        $order = (new OrderModel())->where('razorpay_order_id', $data['order_id'])->first();
        if (! $order || $order['status'] !== 'paid') {
            return $this->respond(['ok' => false, 'error' => 'Payment not confirmed for this link'], 403);
        }

        // 1) Ebook uploaded via the admin panel → stream it as an attachment.
        //    (The file lives outside public/ and is only reachable through this
        //     token + paid-order check.)
        $ebook = (new EbookModel())->getActive();
        if ($ebook !== null) {
            $path = WRITEPATH . $ebook['file_path'];
            if (is_file($path)) {
                $response = $this->response->download($path, null, true);
                $response->setFileName($ebook['original_name'] !== '' ? $ebook['original_name'] : 'ebook.pdf');

                return $response;
            }
            log_message('error', 'Active ebook file missing on disk: ' . $ebook['file_path']);
        }

        // 2) Fallback: legacy Google Drive link from .env (when nothing is uploaded).
        $driveUrl = (string) env('EBOOK_GOOGLE_DRIVE_URL', '');
        if ($driveUrl === '') {
            return $this->respond(['ok' => false, 'error' => 'Ebook not configured on server'], 500);
        }

        return redirect()->to($driveUrl);
    }

    // ------------------------------------------------------------------
    // Token helpers (HMAC signed, 60 minute expiry — no database needed)
    // ------------------------------------------------------------------

    /**
     * HMAC signed download token — 30 day expiry so customers can come back
     * and download later. The paid-order check in download() is the real gate;
     * this only stops casual link sharing.
     */
    private function issueDownloadToken(string $orderId): string
    {
        $payload = $orderId . '|' . (time() + 30 * 24 * 3600);
        $sig     = hash_hmac('sha256', $payload, (string) env('EBOOK_DOWNLOAD_SECRET', 'dev'));

        return rtrim(strtr(base64_encode($payload), '+/', '-_'), '=') . '.' . $sig;
    }

    private function readDownloadToken(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            return null;
        }

        [$encoded, $sig] = $parts;
        $payload = base64_decode(strtr($encoded, '-_', '+/'), true);
        if ($payload === false || ! str_contains($payload, '|')) {
            return null;
        }

        $expected = hash_hmac('sha256', $payload, (string) env('EBOOK_DOWNLOAD_SECRET', 'dev'));
        if (! hash_equals($expected, $sig)) {
            return null;
        }

        [$orderId, $expiry] = explode('|', $payload);
        if ((int) $expiry < time()) {
            return null;
        }

        return ['order_id' => $orderId];
    }

    // ------------------------------------------------------------------

    /**
     * Current selling price in paise (100 = ₹1).
     * Source of truth: admin-managed `settings.ebook_price`, fallback: .env config.
     */
    private function currentPricePaise(): int
    {
        $price = (new SettingModel())->getValue('ebook_price');

        if ($price !== null && is_numeric($price)) {
            $paise = (int) round((float) $price * 100);
            if ($paise >= 100) { // Razorpay minimum ₹1
                return $paise;
            }
        }

        return max(100, (int) config(Payments::class)->productPricePaise);
    }

    private function razorpayKeyPublic(): string
    {
        return (string) env('RAZORPAY_KEY_ID', '');
    }

    private function decodeEvent(string $rawBody): ?string
    {
        $payload = json_decode($rawBody, true);

        return isset($payload['event']) ? (string) $payload['event'] : null;
    }

    private function jsonBody(): array
    {
        $body = $this->request->getJSON(true);

        return is_array($body) ? $body : [];
    }

    private function sanitizeId(string $value): string
    {
        return preg_replace('/[^A-Za-z0-9_-]/', '', mb_substr($value, 0, 64)) ?? '';
    }
}
