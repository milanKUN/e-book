<?php

namespace App\Models;

use CodeIgniter\Model;

class PageViewModel extends Model
{
    protected $table            = 'page_views';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = false;
    protected $useSoftDeletes   = false;

    protected $allowedFields = [
        'visitor_id', 'session_id', 'page_url', 'page_title', 'referrer', 'ip_address', 'created_at',
    ];

    protected $validationRules = [
        'visitor_id' => 'required|max_length[64]',
        'page_url'   => 'required',
    ];
}
