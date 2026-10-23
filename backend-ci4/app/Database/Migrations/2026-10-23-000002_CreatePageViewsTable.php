<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePageViewsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'          => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'visitor_id'  => ['type' => 'VARCHAR', 'constraint' => 64],
            'session_id'  => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'page_url'    => ['type' => 'VARCHAR', 'constraint' => 1024],
            'page_title'  => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'referrer'    => ['type' => 'VARCHAR', 'constraint' => 1024, 'null' => true],
            'ip_address'  => ['type' => 'VARCHAR', 'constraint' => 45, 'null' => true],
            'created_at'  => ['type' => 'DATETIME'],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('visitor_id');
        $this->forge->addKey('created_at');
        $this->forge->createTable('page_views', true);
    }

    public function down()
    {
        $this->forge->dropTable('page_views', true);
    }
}
