<?php
// backend/api/end-session.php
require_once __DIR__ . '/helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'error' => 'Method not allowed'], 405);
}

$data = get_json_input();
require_fields($data, ['session_id']);

$session_id = $data['session_id'];
$exit_page = $data['exit_page'] ?? null;
$now = date('Y-m-d H:i:s');

$db = Database::getConnection();

try {
    $stmt = $db->prepare("SELECT started_at FROM sessions WHERE session_id = ?");
    $stmt->execute([$session_id]);
    $session = $stmt->fetch();
    
    if ($session) {
        $started_at = strtotime($session['started_at']);
        $ended_at = strtotime($now);
        $duration = max(0, $ended_at - $started_at);
        
        $update = $db->prepare("UPDATE sessions SET last_activity = ?, ended_at = ?, duration_seconds = ?, exit_page = ? WHERE session_id = ?");
        $update->execute([$now, $now, $duration, substr($exit_page, 0, 500), $session_id]);
    }

    send_json(['success' => true]);
} catch (Exception $e) {
    error_log("Error in end-session: " . $e->getMessage());
    send_json(['success' => false, 'error' => 'Database error'], 500);
}
