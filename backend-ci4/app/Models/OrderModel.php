<?php

namespace App\Models;

use CodeIgniter\Model;

class OrderModel extends Model
{
    protected $table            = 'orders';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = true;
    protected $dateFormat       = 'datetime';
    protected $useSoftDeletes   = false;

    protected $allowedFields = [
        'razorpay_order_id', 'razorpay_payment_id', 'customer_name', 'customer_email',
        'customer_phone', 'amount', 'currency', 'status', 'method', 'signature',
        'receipt', 'download_token', 'visitor_id', 'notes', 'paid_at',
    ];

    protected $validationRules = [
        'razorpay_order_id' => 'required|max_length[64]|is_unique[orders.razorpay_order_id]',
        'customer_email'    => 'required|valid_email',
        'amount'            => 'required|integer',
        'status'            => 'required|in_list[created,paid,failed,refunded]',
    ];
}
