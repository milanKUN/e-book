<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\EbookModel;
use App\Models\SettingModel;

class SettingsController extends BaseController
{
    private const EBOOK_DIR = 'ebook'; // WRITEPATH . 'ebook' — NOT publicly served
    private const MAX_EBOOK_BYTES = 48 * 1024 * 1024; // 48 MB (PHP upload cap is 50M)

    /**
     * GET /admin/settings
     * Store settings (pricing) + ebook file form.
     */
    public function index()
    {
        $settings    = new SettingModel();
        $ebookPrice  = $settings->getValue('ebook_price', '1');
        $origPrice   = $settings->getValue('original_price', '999');

        return view('admin/settings', [
            'ebookPrice' => $ebookPrice,
            'origPrice'  => $origPrice,
            'ebook'      => (new EbookModel())->getActive(),
            'saved'      => $this->request->getGet('saved') !== null,
            'uploaded'   => $this->request->getGet('uploaded') !== null,
            'error'      => (string) ($this->request->getGet('error') ?? ''),
        ]);
    }

    /**
     * POST /admin/settings
     * Validate + save pricing. The website and Razorpay orders both use this.
     */
    public function save()
    {
        $ebookPrice = str_replace(',', '', trim((string) $this->request->getPost('ebook_price')));
        $origPrice  = str_replace(',', '', trim((string) $this->request->getPost('original_price')));

        // --- Validate selling price --------------------------------------
        if (! is_numeric($ebookPrice)) {
            return $this->redirectWithError('Selling price must be a number, e.g. 99 or 99.50');
        }
        $ebookPrice = (float) $ebookPrice;
        if ($ebookPrice < 1) {
            return $this->redirectWithError('Selling price must be at least ₹1 (Razorpay minimum)');
        }
        if ($ebookPrice > 100000) {
            return $this->redirectWithError('Selling price looks too high — max ₹1,00,000');
        }

        // --- Validate original / MRP price -------------------------------
        if ($origPrice !== '' && ! is_numeric($origPrice)) {
            return $this->redirectWithError('Original price must be a number (or leave it empty)');
        }
        $origPrice = $origPrice === '' ? null : max(0, (float) $origPrice);

        $settings = new SettingModel();
        $settings->setValue(
            'ebook_price',
            $this->formatRupees($ebookPrice),
            'Selling price of the ebook in INR (shown on site + used for Razorpay orders)'
        );
        $settings->setValue(
            'original_price',
            $origPrice === null ? null : $this->formatRupees($origPrice),
            'Original / MRP price shown struck-through on the site'
        );

        return redirect()->to('/admin/settings?saved=1');
    }

    /**
     * POST /admin/settings/upload-ebook (multipart form)
     * Uploads the PDF that paying customers download after checkout.
     * The file lives OUTSIDE public/ — it is only ever served by
     * /api/payments/download after a valid token + paid order check.
     */
    public function uploadEbook()
    {
        $file = $this->request->getFile('ebook_file');

        if ($file === null || ! $file->isValid()) {
            return $this->redirectWithError('No file selected, or the upload failed. Please choose a PDF and try again.');
        }

        if ($file->hasMoved()) {
            return $this->redirectWithError('This file was already uploaded. Please pick a file again.');
        }

        // PDF only — extension AND detected mime type must agree.
        $ext  = strtolower($file->getExtension());
        $mime = (string) $file->getMimeType();
        if ($ext !== 'pdf' || ! in_array($mime, ['application/pdf', 'application/x-pdf'], true)) {
            return $this->redirectWithError('Only PDF files are allowed (detected type: ' . ($mime !== '' ? $mime : 'unknown') . ').');
        }

        if ($file->getSize() > self::MAX_EBOOK_BYTES) {
            return $this->redirectWithError('File is too large — the maximum is 48 MB.');
        }

        $clientName = mb_substr($file->getClientName(), 0, 255);
        $dir        = WRITEPATH . self::EBOOK_DIR . DIRECTORY_SEPARATOR;
        if (! is_dir($dir) && ! mkdir($dir, 0755, true) && ! is_dir($dir)) {
            return $this->redirectWithError('Could not create the storage folder on the server.');
        }

        $storedName = 'ebook_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.pdf';

        try {
            $file->move($dir, $storedName, true);
        } catch (\Throwable $e) {
            log_message('error', 'Ebook upload failed: ' . $e->getMessage());

            return $this->redirectWithError('Could not save the uploaded file. Please try again.');
        }

        $model    = new EbookModel();
        $previous = $model->getActive();

        // Replace the previous active file (keep DB history, delete old bytes).
        if ($previous) {
            $oldPath = WRITEPATH . $previous['file_path'];
            if (is_file($oldPath)) {
                @unlink($oldPath);
            }
            $model->deactivateAll();
        }

        $model->insert([
            'original_name' => $clientName,
            'stored_name'   => $storedName,
            'file_path'     => self::EBOOK_DIR . '/' . $storedName,
            'file_size'     => (int) $file->getSize(),
            'mime'          => 'application/pdf',
            'is_active'     => 1,
        ]);

        return redirect()->to('/admin/settings?uploaded=1');
    }

    // ------------------------------------------------------------------

    private function redirectWithError(string $message)
    {
        return redirect()->to('/admin/settings?error=' . urlencode($message));
    }

    private function formatRupees(float $value): string
    {
        return ($value == floor($value)) ? (string) (int) $value : number_format($value, 2, '.', '');
    }
}
