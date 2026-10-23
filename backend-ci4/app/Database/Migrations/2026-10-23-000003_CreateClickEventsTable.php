<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateClickEventsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'           => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'visitor_id'   => ['type' => 'VARCHAR', 'constraint' => 64],
            'session_id'   => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'event_name'   => ['type' => 'VARCHAR', 'constraint' => 64],
            'element_id'   => ['type' => 'VARCHAR', 'constraint' => 128, 'null' => true],
            'element_text' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'page_url'     => ['type' => 'VARCHAR', 'constraint' => 1024],
            'tag'          => ['type' => 'VARCHAR', 'constraint' => 16, 'null' => true],
            'href'         => ['type' => 'VARCHAR', 'constraint' => 1024, 'null' => true],
            'event_data'   => ['type' => 'JSON', 'null' => true],
            'ip_address'   => ['type' => 'VARCHAR', 'constraint' => 45, 'null' => true],
            'created_at'   => ['type' => 'DATETIME'],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('visitor_id');
        $this->forge->addKey('event_name');
        $this->forge->addKey('created_at');
        $this->forge->createTable('click_events', true);
    }

    public function down()
    {
        $this->forge->dropTable('click_events', true);
    }
}
