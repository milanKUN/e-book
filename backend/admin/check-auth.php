<?php
// backend/admin/check-auth.php
require_once __DIR__ . '/auth.php';
check_admin_auth();
send_json(['success' => true]);
