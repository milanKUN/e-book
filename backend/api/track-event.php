<?php
// backend/api/track-event.php
require_once __DIR__ . '/helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'error' => 'Method not allowed'], 405);
}

$data = get_json_input();
require_fields($data, ['visitor_id', 'session_id', 'event_name']);

$visitor_id = $data['visitor_id'];
$session_id = $data['session_id'];
$event_name = $data['event_name'];
$element_id = $data['element_id'] ?? null;
$element_text = $data['element_text'] ?? null;
$page_url = $data['page_url'] ?? null;
$event_data = isset($data['event_data']) ? json_encode($data['event_data']) : null;
$now = date('Y-m-d H:i:s');

$db = Database::getConnection();

try {
    $db->beginTransaction();
    
    $insertEvent = $db->prepare("INSERT INTO events (session_id, visitor_id, event_name, element_id, element_text, page_url, event_data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $insertEvent->execute([$session_id, $visitor_id, substr($event_name, 0, 100), substr($element_id, 0, 100), substr($element_text, 0, 255), substr($page_url, 0, 500), $event_data, $now]);

    $updateSession = $db->prepare("UPDATE sessions SET last_activity = ? WHERE session_id = ?");
    $updateSession->execute([$now, $session_id]);

    $db->commit();
    send_json(['success' => true]);
} catch (Exception $e) {
    $db->rollBack();
    error_log("Error in track-event: " . $e->getMessage());
    send_json(['success' => false, 'error' => 'Database error'], 500);
}
