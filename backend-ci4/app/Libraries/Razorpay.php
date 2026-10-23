<?php

namespace App\Libraries;

use Config\Payments;

/**
 * Minimal Razorpay REST API client (Orders + Payments + Signature verification).
 * Uses cURL directly — no external package required.
 */
class Razorpay
{
    private string $keyId;
    private string $keySecret;
    private string $baseUrl = 'https://api.razorpay.com/v1';

    public function __construct()
    {
        $config   = config(Payments::class);
        $this->keyId     = $config->razorpayKeyId;
        $this->keySecret = $config->razorpayKeySecret;
    }

    public function isConfigured(): bool
    {
        return $this->keyId !== '' && $this->keySecret !== '';
    }

    /**
     * Create a Payment Order.
     *
     * @param int    $amount  Amount in paise
     * @param string $receipt Unique receipt reference
     * @param array  $notes   Optional notes
     *
     * @return array Decoded Razorpay response
     * @throws \RuntimeException
     */
    public function createOrder(int $amount, string $receipt, array $notes = []): array
    {
        $payload = [
            'amount'   => $amount,
            'currency' => 'INR',
            'receipt'  => $receipt,
        ];

        if ($notes !== []) {
            $payload['notes'] = $notes;
        }

        return $this->request('POST', '/orders', $payload);
    }

    /**
     * Fetch a payment by id (used by webhook/verification fallback).
     */
    public function fetchPayment(string $paymentId): array
    {
        return $this->request('GET', '/payments/' . rawurlencode($paymentId));
    }

    /**
     * Fetch an order by id.
     */
    public function fetchOrder(string $orderId): array
    {
        return $this->request('GET', '/orders/' . rawurlencode($orderId));
    }

    /**
     * Verify the checkout signature returned to the browser.
     * signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
     */
    public function verifySignature(string $orderId, string $paymentId, string $signature): bool
    {
        if ($signature === '' || $orderId === '' || $paymentId === '') {
            return false;
        }

        $expected = hash_hmac('sha256', $orderId . '|' . $paymentId, $this->keySecret);

        return hash_equals($expected, $signature);
    }

    /**
     * Verify a webhook signature (HMAC of the RAW request body).
     */
    public function verifyWebhookSignature(string $rawBody, string $signature, string $webhookSecret): bool
    {
        if ($webhookSecret === '' || $signature === '') {
            return false;
        }

        $expected = hash_hmac('sha256', $rawBody, $webhookSecret);

        return hash_equals($expected, $signature);
    }

    /**
     * Low-level cURL request with Basic Auth.
     */
    private function request(string $method, string $path, array $payload = []): array
    {
        if (! $this->isConfigured()) {
            throw new \RuntimeException('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
        }

        $ch = curl_init($this->baseUrl . $path);

        $opts = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_USERPWD        => $this->keyId . ':' . $this->keySecret,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_CUSTOMREQUEST  => $method,
        ];

        // Windows/WAMP often lacks a configured CA bundle → fix SSL "self-signed" errors.
        $caBundle = ROOTPATH . 'writable' . DIRECTORY_SEPARATOR . 'cacert.pem';
        if (is_file($caBundle)) {
            $opts[CURLOPT_CAINFO] = $caBundle;
        }

        curl_setopt_array($ch, $opts);

        if ($method !== 'GET' && $payload !== []) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        }

        $response = curl_exec($ch);
        $errno    = curl_errno($ch);
        $error    = curl_error($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($response === false || $errno !== 0) {
            throw new \RuntimeException('Razorpay API cURL error: ' . $error);
        }

        $decoded = json_decode((string) $response, true);

        if ($httpCode >= 400) {
            $description = $decoded['error']['description'] ?? $response;
            throw new \RuntimeException('Razorpay API error (' . $httpCode . '): ' . $description);
        }

        return is_array($decoded) ? $decoded : [];
    }
}
