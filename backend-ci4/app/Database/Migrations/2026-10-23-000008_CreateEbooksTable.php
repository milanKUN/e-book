<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateEbooksTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'            => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'original_name' => ['type' => 'VARCHAR', 'constraint' => 255],
            'stored_name'   => ['type' => 'VARCHAR', 'constraint' => 255],
            // Path relative to WRITEPATH, e.g. "ebook/ebook_1729....pdf"
            'file_path'     => ['type' => 'VARCHAR', 'constraint' => 255],
            'file_size'     => ['type' => 'BIGINT', 'unsigned' => true, 'default' => 0],
            'mime'          => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'is_active'     => ['type' => 'TINYINT', 'unsigned' => true, 'default' => 1],
            'created_at'    => ['type' => 'DATETIME', 'null' => true],
            'updated_at'    => ['type' => 'DATETIME', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('is_active');
        $this->forge->createTable('ebooks', true);
    }

    public function down()
    {
        $this->forge->dropTable('ebooks', true);
    }
}
