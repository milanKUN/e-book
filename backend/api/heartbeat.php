<?php
// backend/api/heartbeat.php
require_once __DIR__ . '/helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'error' => 'Method not allowed'], 405);
}

$data = get_json_input();
require_fields($data, ['visitor_id', 'session_id']);

$visitor_id = $data['visitor_id'];
$session_id = $data['session_id'];
$now = date('Y-m-d H:i:s');

$db = Database::getConnection();

try {
    $db->beginTransaction();
    
    $updateSession = $db->prepare("UPDATE sessions SET last_activity = ? WHERE session_id = ?");
    $updateSession->execute([$now, $session_id]);
    
    $updateVisitor = $db->prepare("UPDATE visitors SET last_seen = ? WHERE visitor_id = ?");
    $updateVisitor->execute([$now, $visitor_id]);

    $db->commit();
    send_json(['success' => true]);
} catch (Exception $e) {
    $db->rollBack();
    send_json(['success' => false, 'error' => 'Database error'], 500);
}
