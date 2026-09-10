<?php
// backend/config/config.php

// Application configuration
define('APP_NAME', 'ChatGPT eBook Analytics');
define('APP_VERSION', '1.0.0');

// Database configuration
// Change these in production!
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'analytics_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');

// CORS Configuration
// In production, this should be the exact domain of the frontend (e.g. 'https://gurunetra.com')
define('ALLOWED_ORIGIN', getenv('ALLOWED_ORIGIN') ?: '*');

// Admin Authentication
define('ADMIN_USERNAME', getenv('ADMIN_USERNAME') ?: 'admin');
// Default password is 'admin123'
// Generate a new hash using password_hash('your_password', PASSWORD_DEFAULT)
define('ADMIN_PASSWORD_HASH', getenv('ADMIN_PASSWORD_HASH') ?: '$2y$10$vO8wQv.uM8t4fJ4M0fM3.evmN7QO/R3y7W2B/rV4f.g8e/t4Z8W');

// Set timezone
date_default_timezone_set('UTC');

/**
 * Helper function to handle CORS headers
 */
function handle_cors() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    // In a real production environment with ALLOWED_ORIGIN !== '*',
    // you would check if $origin matches ALLOWED_ORIGIN.
    // For safety, if ALLOWED_ORIGIN is '*', we allow all, otherwise we only allow exact match.
    if (ALLOWED_ORIGIN === '*' || $origin === ALLOWED_ORIGIN) {
        header("Access-Control-Allow-Origin: " . ($origin ? $origin : '*'));
    }
    
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
