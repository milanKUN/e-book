<?php

namespace App\Models;

use CodeIgniter\Model;

class RazorpayWebhookModel extends Model
{
    protected $table            = 'razorpay_webhooks';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = true;
    protected $dateFormat       = 'datetime';
    protected $useSoftDeletes   = false;

    protected $allowedFields = [
        'event_id', 'event_type', 'razorpay_order_id', 'razorpay_payment_id',
        'status', 'payload', 'signature_valid', 'processed',
    ];

    protected $validationRules = [
        'event_id'   => 'required|max_length[100]|is_unique[razorpay_webhooks.event_id]',
        'event_type' => 'required|max_length[100]',
    ];
}
