<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\SettingModel;
use Config\Payments;

class SettingsController extends BaseController
{
    /**
     * GET /api/settings
     * Public pricing info for the frontend (no secrets here).
     * Fallbacks come from Config\Payments / .env when the DB has no values yet.
     */
    public function index()
    {
        $settings = new SettingModel();
        $config   = config(Payments::class);

        $priceRupees     = (float) ($settings->getValue('ebook_price') ?? ($config->productPricePaise / 100));
        $originalRupees  = (float) ($settings->getValue('original_price') ?? 999);

        // Razorpay minimum is ₹1 — never let the public price go below it.
        if ($priceRupees < 1) {
            $priceRupees = 1;
        }

        return $this->response->setJSON([
            'ok'             => true,
            'product_price'  => $this->formatRupees($priceRupees),
            'original_price' => $this->formatRupees($originalRupees),
            'price_paise'    => (int) round($priceRupees * 100),
        ]);
    }

    private function formatRupees(float $value): string
    {
        // Drop trailing ".00" so ₹99 stays ₹99 (not ₹99.00) on the site.
        return ($value == floor($value)) ? (string) (int) $value : number_format($value, 2, '.', '');
    }
}
