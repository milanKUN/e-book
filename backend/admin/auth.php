<?php
// backend/admin/auth.php
session_start();

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../api/helper.php';

function check_admin_auth() {
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        send_json(['success' => false, 'error' => 'Unauthorized'], 401);
    }
}
