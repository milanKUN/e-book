<?php

namespace App\Database\Seeds;

use App\Models\AdminModel;
use CodeIgniter\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run()
    {
        $username = 'admin';
        $password = (string) env('ADMIN_SEED_PASSWORD', 'Admin@1234');

        $model = new AdminModel();

        if ($model->where('username', $username)->first()) {
            echo "Admin user already exists — skipping.\n";

            return;
        }

        $model->insert([
            'username'      => $username,
            'email'         => 'gurunetra@gmail.com',
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'role'          => 'admin',
            'last_login_at' => null,
        ]);

        echo "Admin user created: {$username} / {$password}\n";
    }
}
