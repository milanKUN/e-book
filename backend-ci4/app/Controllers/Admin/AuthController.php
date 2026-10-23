<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\AdminModel;

class AuthController extends BaseController
{
    /**
     * GET /admin/login
     */
    public function login()
    {
        if (session()->get('admin_id')) {
            return redirect()->to('/admin');
        }

        return view('admin/login', [
            'error' => session()->getFlashdata('error'),
        ]);
    }

    /**
     * POST /admin/login
     */
    public function attempt()
    {
        $username = trim((string) $this->request->getPost('username'));
        $password = (string) $this->request->getPost('password');

        $admin = (new AdminModel())->where('username', $username)->first();

        if (! $admin || ! password_verify($password, $admin['password_hash'])) {
            return redirect()->back()->with('error', 'Invalid username or password.');
        }

        (new AdminModel())->update($admin['id'], ['last_login_at' => date('Y-m-d H:i:s')]);

        session()->set([
            'admin_id'   => $admin['id'],
            'admin_name' => $admin['username'],
        ]);

        return redirect()->to('/admin');
    }

    /**
     * GET /admin/logout
     */
    public function logout()
    {
        session()->destroy();

        return redirect()->to('/admin/login');
    }
}
