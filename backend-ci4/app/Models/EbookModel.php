<?php

namespace App\Models;

use CodeIgniter\Model;

class EbookModel extends Model
{
    protected $table            = 'ebooks';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = true;
    protected $dateFormat       = 'datetime';
    protected $useSoftDeletes   = false;

    protected $allowedFields = [
        'original_name', 'stored_name', 'file_path', 'file_size', 'mime', 'is_active',
    ];

    protected $validationRules = [
        'original_name' => 'required|max_length[255]',
        'file_path'     => 'required|max_length[255]',
    ];

    /**
     * The single active ebook (the file paying customers download).
     */
    public function getActive(): ?array
    {
        return $this->where('is_active', 1)->orderBy('id', 'DESC')->first();
    }

    /**
     * Make every row inactive (called before inserting a new upload).
     */
    public function deactivateAll(): void
    {
        $db = $this->db;
        $db->table($this->table)->where('is_active', 1)->update(['is_active' => 0]);
    }
}
