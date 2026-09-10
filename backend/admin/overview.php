<?php
// backend/admin/overview.php
require_once __DIR__ . '/auth.php';
check_admin_auth();

$db = Database::getConnection();

$date_range = $_GET['range'] ?? '7days';

$whereClause = "";
$params = [];

if ($date_range === 'today') {
    $whereClause = "DATE(created_at) = CURDATE()";
} elseif ($date_range === 'yesterday') {
    $whereClause = "DATE(created_at) = CURDATE() - INTERVAL 1 DAY";
} elseif ($date_range === '7days') {
    $whereClause = "created_at >= NOW() - INTERVAL 7 DAY";
} elseif ($date_range === '30days') {
    $whereClause = "created_at >= NOW() - INTERVAL 30 DAY";
} else {
    $whereClause = "created_at >= NOW() - INTERVAL 7 DAY"; // default
}

// Ensure WHERE clause can be used universally by prepending "WHERE " for simple queries
$whereClauseFull = $whereClause ? "WHERE $whereClause" : "";

try {
    $overview = [];

    // 1. Total Visitors
    $stmt = $db->query("SELECT COUNT(DISTINCT visitor_id) as count FROM visitors $whereClauseFull");
    $overview['unique_visitors'] = $stmt->fetch()['count'];

    // 2. Total Sessions
    $stmt = $db->query("SELECT COUNT(DISTINCT session_id) as count FROM sessions $whereClauseFull");
    $overview['sessions'] = $stmt->fetch()['count'];

    // 3. Page Views
    $stmt = $db->query("SELECT COUNT(*) as count FROM page_views $whereClauseFull");
    $overview['page_views'] = $stmt->fetch()['count'];

    // 4. Active Now (last 2 minutes)
    $stmt = $db->query("SELECT COUNT(DISTINCT session_id) as count FROM sessions WHERE last_activity >= NOW() - INTERVAL 2 MINUTE");
    $overview['active_now'] = $stmt->fetch()['count'];

    // 5. Avg Session Duration
    $stmt = $db->query("SELECT AVG(duration_seconds) as avg_sec FROM sessions $whereClauseFull AND duration_seconds > 0");
    $overview['avg_duration'] = round((float) $stmt->fetch()['avg_sec']);

    // 6. Payment Button Clicks
    $stmt = $db->query("SELECT COUNT(*) as count FROM events WHERE event_name = 'payment_button_click' AND " . str_replace("created_at", "events.created_at", $whereClause));
    $overview['payment_clicks'] = $stmt->fetch()['count'];

    // 7. Top Pages
    $stmt = $db->query("SELECT page_url, COUNT(*) as views FROM page_views $whereClauseFull GROUP BY page_url ORDER BY views DESC LIMIT 10");
    $overview['top_pages'] = $stmt->fetchAll();
    
    // 8. Device types
    $stmt = $db->query("SELECT device_type, COUNT(*) as count FROM visitors $whereClauseFull GROUP BY device_type");
    $overview['devices'] = $stmt->fetchAll();

    // 9. Traffic by day
    $stmt = $db->query("SELECT DATE(created_at) as date, COUNT(DISTINCT visitor_id) as visitors FROM visitors $whereClauseFull GROUP BY DATE(created_at) ORDER BY date ASC");
    $overview['traffic'] = $stmt->fetchAll();

    send_json(['success' => true, 'data' => $overview]);
} catch (Exception $e) {
    error_log("Error in admin overview: " . $e->getMessage());
    send_json(['success' => false, 'error' => 'Database error'], 500);
}
