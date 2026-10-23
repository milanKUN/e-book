<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateOrdersTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'               => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'razorpay_order_id'=> ['type' => 'VARCHAR', 'constraint' => 64, 'unique' => true],
            'razorpay_payment_id' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'customer_name'    => ['type' => 'VARCHAR', 'constraint' => 191],
            'customer_email'   => ['type' => 'VARCHAR', 'constraint' => 191],
            'customer_phone'   => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'amount'           => ['type' => 'INT', 'unsigned' => true], // in paise
            'currency'         => ['type' => 'VARCHAR', 'constraint' => 8, 'default' => 'INR'],
            'status'           => ['type' => 'VARCHAR', 'constraint' => 20, 'default' => 'created'],
            // created | paid | failed | refunded
            'method'           => ['type' => 'VARCHAR', 'constraint' => 32, 'null' => true],
            'signature'        => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'receipt'          => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'download_token'   => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'visitor_id'       => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'notes'            => ['type' => 'TEXT', 'null' => true],
            'paid_at'          => ['type' => 'DATETIME', 'null' => true],
            'created_at'       => ['type' => 'DATETIME', 'null' => true],
            'updated_at'       => ['type' => 'DATETIME', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('razorpay_payment_id');
        $this->forge->addKey('status');
        $this->forge->addKey('created_at');
        $this->forge->createTable('orders', true);
    }

    public function down()
    {
        $this->forge->dropTable('orders', true);
    }
}
