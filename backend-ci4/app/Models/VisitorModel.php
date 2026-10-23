<?php

namespace App\Models;

use CodeIgniter\Model;

class VisitorModel extends Model
{
    protected $table            = 'visitors';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = true;
    protected $dateFormat       = 'datetime';
    protected $useSoftDeletes   = false;

    protected $allowedFields = [
        'visitor_id', 'ip_address', 'user_agent', 'first_seen_at', 'last_seen_at',
    ];

    protected $validationRules = [
        'visitor_id' => 'required|max_length[64]',
    ];
}
