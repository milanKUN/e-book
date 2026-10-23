<?php

namespace App\Models;

use CodeIgniter\Model;

class SettingModel extends Model
{
    protected $table            = 'settings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = true;
    protected $dateFormat       = 'datetime';
    protected $useSoftDeletes   = false;

    protected $allowedFields = [
        'setting_key', 'setting_value', 'description',
    ];

    protected $validationRules = [
        'setting_key' => 'required|max_length[64]|regex_match[/^[a-z0-9_]+$/]',
    ];

    /**
     * Get a setting value (trimmed string) or the given default.
     */
    public function getValue(string $key, ?string $default = null): ?string
    {
        $row = $this->where('setting_key', $key)->first();
        if ($row === null || $row['setting_value'] === null || trim((string) $row['setting_value']) === '') {
            return $default;
        }

        return trim((string) $row['setting_value']);
    }

    /**
     * Insert or update a setting by key.
     */
    public function setValue(string $key, ?string $value, ?string $description = null): void
    {
        $row = $this->where('setting_key', $key)->first();

        if ($row) {
            $this->update($row['id'], [
                'setting_value' => $value,
                'description'   => $description ?? $row['description'],
            ]);

            return;
        }

        $this->insert([
            'setting_key'   => $key,
            'setting_value' => $value,
            'description'   => $description,
        ]);
    }
}
