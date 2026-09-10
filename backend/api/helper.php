<?php
// backend/api/helper.php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

handle_cors();

function send_json($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function get_json_input() {
    $input = file_get_contents('php://input');
    if (empty($input)) {
        return [];
    }
    $decoded = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        send_json(['success' => false, 'error' => 'Invalid JSON input'], 400);
    }
    return $decoded;
}

function require_fields($data, $fields) {
    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim($data[$field]) === '') {
            send_json(['success' => false, 'error' => "Missing required field: $field"], 400);
        }
    }
}
