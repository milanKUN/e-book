<?php

namespace App\Database\Seeds;

use App\Models\SettingModel;
use CodeIgniter\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run()
    {
        $model = new SettingModel();

        // Selling price (₹) — default follows PRODUCT_PRICE_PAISE from .env (₹1 in test mode).
        $defaultPrice = number_format(((int) env('PRODUCT_PRICE_PAISE', 100)) / 100, 2, '.', '');

        if ($model->getValue('ebook_price') === null) {
            $model->setValue('ebook_price', $defaultPrice, 'Selling price of the ebook in INR (shown on site + used for Razorpay orders)');
            echo "Setting seeded: ebook_price = {$defaultPrice}\n";
        } else {
            echo "Setting already exists: ebook_price — skipping.\n";
        }

        if ($model->getValue('original_price') === null) {
            $model->setValue('original_price', '999.00', 'Original / MRP price shown struck-through on the site');
            echo "Setting seeded: original_price = 999.00\n";
        } else {
            echo "Setting already exists: original_price — skipping.\n";
        }
    }
}
