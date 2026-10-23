<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Payments extends BaseConfig
{
    /**
     * Razorpay API credentials (loaded from .env — NEVER commit real secrets).
     */
    public string $razorpayKeyId;
    public string $razorpayKeySecret;
    public string $razorpayWebhookSecret;

    /**
     * Product price in paise (100 = Rs 1). Server-side authoritative.
     */
    public int $productPricePaise;

    public function __construct()
    {
        parent::__construct();

        $this->razorpayKeyId        = (string) env('RAZORPAY_KEY_ID', '');
        $this->razorpayKeySecret    = (string) env('RAZORPAY_KEY_SECRET', '');
        $this->razorpayWebhookSecret = (string) env('RAZORPAY_WEBHOOK_SECRET', '');
        $this->productPricePaise    = (int) env('PRODUCT_PRICE_PAISE', 100);
    }
}
