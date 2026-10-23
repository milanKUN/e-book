<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

// ---------------------------------------------------------------------
// Public API (called by the React frontend)
// ---------------------------------------------------------------------

// Analytics / click tracking
$routes->group('api', ['filter' => 'cors'], static function ($routes) {
    $routes->post('track/visit',        'Api\TrackingController::visit');
    $routes->post('track/page-view',    'Api\TrackingController::pageView');
    $routes->post('track/event',        'Api\TrackingController::event');
    $routes->post('track/heartbeat',    'Api\TrackingController::heartbeat');
    $routes->post('track/end-session',  'Api\TrackingController::endSession');

    // Public store settings (pricing) — fetched by the frontend
    $routes->get('settings', 'Api\SettingsController::index');

    // Razorpay payments
    $routes->post('payments/create-order', 'Api\PaymentController::createOrder');
    $routes->post('payments/verify',       'Api\PaymentController::verify');
    $routes->get('payments/status',        'Api\PaymentController::status');
    $routes->post('payments/webhook',      'Api\PaymentController::webhook');
    $routes->get('payments/download',      'Api\PaymentController::download');
});

// ---------------------------------------------------------------------
// Admin panel (session protected)
// ---------------------------------------------------------------------

$routes->get('admin/login',  'Admin\AuthController::login');
$routes->post('admin/login', 'Admin\AuthController::attempt');
$routes->get('admin/logout', 'Admin\AuthController::logout');

$routes->group('admin', ['filter' => 'adminAuth'], static function ($routes) {
    $routes->get('',        'Admin\DashboardController::index');
    $routes->get('dashboard', 'Admin\DashboardController::index');
    $routes->get('clicks',  'Admin\DashboardController::clicks');
    $routes->get('orders',  'Admin\DashboardController::orders');
    $routes->get('visitors','Admin\DashboardController::visitors');
    $routes->get('settings','Admin\SettingsController::index');
    $routes->post('settings','Admin\SettingsController::save');
    $routes->post('settings/upload-ebook','Admin\SettingsController::uploadEbook');
});

// Fallback: keep root as a simple info page for the API server
$routes->get('/', static function () {
    return view('home');
});
