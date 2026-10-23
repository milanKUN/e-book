<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateVisitorsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'           => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'visitor_id'   => ['type' => 'VARCHAR', 'constraint' => 64],
            'ip_address'   => ['type' => 'VARCHAR', 'constraint' => 45, 'null' => true],
            'user_agent'   => ['type' => 'VARCHAR', 'constraint' => 512, 'null' => true],
            'first_seen_at'=> ['type' => 'DATETIME'],
            'last_seen_at' => ['type' => 'DATETIME'],
            'created_at'   => ['type' => 'DATETIME', 'null' => true],
            'updated_at'   => ['type' => 'DATETIME', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('visitor_id');
        $this->forge->createTable('visitors', true);
    }

    public function down()
    {
        $this->forge->dropTable('visitors', true);
    }
}
