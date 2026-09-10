<?php
// backend/admin/login.php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../api/helper.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'error' => 'Method not allowed'], 405);
}

$data = get_json_input();
require_fields($data, ['username', 'password']);

if ($data['username'] === ADMIN_USERNAME && password_verify($data['password'], ADMIN_PASSWORD_HASH)) {
    $_SESSION['admin_logged_in'] = true;
    send_json(['success' => true]);
} else {
    send_json(['success' => false, 'error' => 'Invalid credentials'], 401);
}
