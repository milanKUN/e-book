<?php
// backend/api/track-visit.php
require_once __DIR__ . '/helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'error' => 'Method not allowed'], 405);
}

$data = get_json_input();
require_fields($data, ['visitor_id', 'session_id', 'page_url']);

$visitor_id = $data['visitor_id'];
$session_id = $data['session_id'];
$page_url = $data['page_url'];
$referrer = $data['referrer'] ?? null;
$page_title = $data['page_title'] ?? null;
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;

$db = Database::getConnection();

try {
    $db->beginTransaction();

    // 1. Create or update visitor
    $stmt = $db->prepare("SELECT id FROM visitors WHERE visitor_id = ?");
    $stmt->execute([$visitor_id]);
    
    $now = date('Y-m-d H:i:s');
    
    if ($stmt->rowCount() === 0) {
        // Basic device parsing from user agent (lightweight, no fingerprinting)
        $isMobile = preg_match('/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/', $user_agent);
        $device_type = $isMobile ? 'Mobile' : 'Desktop';
        
        $insertVisitor = $db->prepare("INSERT INTO visitors (visitor_id, first_seen, last_seen, user_agent, device_type) VALUES (?, ?, ?, ?, ?)");
        $insertVisitor->execute([$visitor_id, $now, $now, substr($user_agent, 0, 500), $device_type]);
    } else {
        $updateVisitor = $db->prepare("UPDATE visitors SET last_seen = ? WHERE visitor_id = ?");
        $updateVisitor->execute([$now, $visitor_id]);
    }

    // 2. Create session if not exists
    $stmt = $db->prepare("SELECT id FROM sessions WHERE session_id = ?");
    $stmt->execute([$session_id]);
    
    if ($stmt->rowCount() === 0) {
        $insertSession = $db->prepare("INSERT INTO sessions (session_id, visitor_id, started_at, last_activity, landing_page, referrer) VALUES (?, ?, ?, ?, ?, ?)");
        $insertSession->execute([$session_id, $visitor_id, $now, $now, substr($page_url, 0, 500), substr($referrer, 0, 500)]);
    } else {
        $updateSession = $db->prepare("UPDATE sessions SET last_activity = ? WHERE session_id = ?");
        $updateSession->execute([$now, $session_id]);
    }
    
    // 3. Track this initial page view
    $insertPv = $db->prepare("INSERT INTO page_views (session_id, visitor_id, page_url, page_title, referrer, viewed_at) VALUES (?, ?, ?, ?, ?, ?)");
    $insertPv->execute([$session_id, $visitor_id, substr($page_url, 0, 500), substr($page_title, 0, 255), substr($referrer, 0, 500), $now]);

    $db->commit();
    
    send_json(['success' => true, 'message' => 'Visit tracked']);
} catch (Exception $e) {
    $db->rollBack();
    error_log("Error in track-visit: " . $e->getMessage());
    send_json(['success' => false, 'error' => 'Database error'], 500);
}
