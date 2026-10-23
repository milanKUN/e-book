<?php

namespace App\Models;

use CodeIgniter\Model;

class ClickEventModel extends Model
{
    protected $table            = 'click_events';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = false;
    protected $useSoftDeletes   = false;

    protected $allowedFields = [
        'visitor_id', 'session_id', 'event_name', 'element_id', 'element_text',
        'page_url', 'tag', 'href', 'event_data', 'ip_address', 'created_at',
    ];

    protected $validationRules = [
        'visitor_id' => 'required|max_length[64]',
        'event_name' => 'required|max_length[64]',
        'page_url'   => 'required',
    ];

    /**
     * The BUY NOW / GET THE GUIDE / UNLOCK buttons — clicking one opens the
     * checkout modal. This is the definitive "payment button click" metric.
     */
    public const PAYMENT_BUTTON_EVENTS = ['checkout_start'];

    /**
     * Full checkout funnel events (in order). Used for the breakdown table.
     */
    public const CHECKOUT_FUNNEL_EVENTS = [
        'checkout_start',   // BUY NOW / GET THE GUIDE button clicked
        'form_submit',      // checkout form (PAY button) submitted
        'order_created',    // Razorpay order created on the backend
        'payment_success',  // payment verified
    ];
}
