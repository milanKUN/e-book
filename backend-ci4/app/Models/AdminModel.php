<?php

namespace App\Models;

use CodeIgniter\Model;

class AdminModel extends Model
{
    protected $table            = 'admins';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = true;
    protected $dateFormat       = 'datetime';
    protected $useSoftDeletes   = false;

    protected $allowedFields = [
        'username', 'email', 'password_hash', 'role', 'last_login_at',
    ];

    protected $validationRules = [
        'username'      => 'required|max_length[100]|is_unique[admins.username]',
        'password_hash' => 'required',
    ];
}
