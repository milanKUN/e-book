<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateRazorpayWebhooksTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'            => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'event_id'      => ['type' => 'VARCHAR', 'constraint' => 100, 'unique' => true],
            'event_type'    => ['type' => 'VARCHAR', 'constraint' => 100],
            'razorpay_order_id'   => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'razorpay_payment_id'  => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'status'        => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'payload'       => ['type' => 'TEXT'],
            'signature_valid'=> ['type' => 'TINYINT', 'constraint' => 1, 'default' => 0],
            'processed'     => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 0],
            'created_at'    => ['type' => 'DATETIME', 'null' => true],
            'updated_at'    => ['type' => 'DATETIME', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('razorpay_order_id');
        $this->forge->createTable('razorpay_webhooks', true);
    }

    public function down()
    {
        $this->forge->dropTable('razorpay_webhooks', true);
    }
}
