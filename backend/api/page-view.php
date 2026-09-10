<?php
// backend/api/page-view.php
require_once __DIR__ . '/helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'error' => 'Method not allowed'], 405);
}

$data = get_json_input();
require_fields($data, ['visitor_id', 'session_id', 'page_url']);

$visitor_id = $data['visitor_id'];
$session_id = $data['session_id'];
$page_url = $data['page_url'];
$page_title = $data['page_title'] ?? null;
$referrer = $data['referrer'] ?? null;
$now = date('Y-m-d H:i:s');

$db = Database::getConnection();

try {
    $db->beginTransaction();
    
    $insertPv = $db->prepare("INSERT INTO page_views (session_id, visitor_id, page_url, page_title, referrer, viewed_at) VALUES (?, ?, ?, ?, ?, ?)");
    $insertPv->execute([$session_id, $visitor_id, substr($page_url, 0, 500), substr($page_title, 0, 255), substr($referrer, 0, 500), $now]);

    $updateSession = $db->prepare("UPDATE sessions SET last_activity = ? WHERE session_id = ?");
    $updateSession->execute([$now, $session_id]);
    
    $updateVisitor = $db->prepare("UPDATE visitors SET last_seen = ? WHERE visitor_id = ?");
    $updateVisitor->execute([$now, $visitor_id]);

    $db->commit();
    send_json(['success' => true]);
} catch (Exception $e) {
    $db->rollBack();
    error_log("Error in page-view: " . $e->getMessage());
    send_json(['success' => false, 'error' => 'Database error'], 500);
}
