<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\ClickEventModel;
use App\Models\OrderModel;
use App\Models\PageViewModel;
use App\Models\VisitorModel;

class DashboardController extends BaseController
{
    /**
     * GET /admin
     * Overview: totals, payment-button clicks, conversion funnel, recent orders.
     */
    public function index()
    {
        $db = \Config\Database::connect();

        $today = date('Y-m-d');

        // --- Core counters -------------------------------------------------
        $totalVisitors   = (int) $db->table('visitors')->countAllResults();
        $todayVisitors   = (int) $db->table('visitors')->where('DATE(first_seen_at)', $today)->countAllResults();
        $totalPageViews  = (int) $db->table('page_views')->countAllResults();
        $todayPageViews  = (int) $db->table('page_views')->where('DATE(created_at)', $today)->countAllResults();
        $totalClicks     = (int) $db->table('click_events')->countAllResults();

        // --- Payment button clicks (the key metric) ------------------------
        // "Payment button" = the BUY NOW / GET THE GUIDE / UNLOCK buttons.
        // Each click fires checkout_start exactly ONCE (data-analytics-event).
        $paymentButtonEvents = ClickEventModel::PAYMENT_BUTTON_EVENTS;
        $funnelEvents        = ClickEventModel::CHECKOUT_FUNNEL_EVENTS;

        $paymentClicksTotal = (int) $db->table('click_events')
            ->whereIn('event_name', $paymentButtonEvents)->countAllResults();
        $paymentClicksToday = (int) $db->table('click_events')
            ->whereIn('event_name', $paymentButtonEvents)
            ->where('DATE(created_at)', $today)->countAllResults();

        // Breakdown by funnel event (checkout_start -> form_submit -> order_created -> payment_success)
        $funnelTotals = [];
        $rows = $db->table('click_events')
            ->select('event_name, COUNT(*) AS total, COUNT(DISTINCT visitor_id) AS unique_visitors')
            ->whereIn('event_name', $funnelEvents)
            ->groupBy('event_name')
            ->get()->getResultArray();
        foreach ($rows as $row) {
            $funnelTotals[$row['event_name']] = $row;
        }
        // Present strictly in funnel order
        $clicksByEvent = [];
        foreach ($funnelEvents as $eventName) {
            if (isset($funnelTotals[$eventName])) {
                $clicksByEvent[] = $funnelTotals[$eventName];
            }
        }

        // --- Orders / revenue ---------------------------------------------
        $ordersTotal = (int) $db->table('orders')->countAllResults();
        $ordersPaid  = (int) $db->table('orders')->where('status', 'paid')->countAllResults();
        $ordersToday = (int) $db->table('orders')->where('DATE(created_at)', $today)->countAllResults();
        $revenuePaise = (int) ($db->table('orders')->selectSum('amount')->where('status', 'paid')->get()->getRow()->amount ?? 0);

        // --- Conversion funnel --------------------------------------------
        // Each step counted from its own single source — no double counting.
        $funnel = [
            'visited'          => $totalVisitors,
            'clicked_buy'      => $this->countEvent($paymentButtonEvents), // payment button clicked
            'opened_checkout'  => $this->countEvent('form_submit'),        // PAY form submitted
            'orders_created'   => $ordersTotal,                            // orders table
            'orders_paid'      => $ordersPaid,                             // orders table (paid)
        ];

        // --- Recent orders -------------------------------------------------
        $recentOrders = $db->table('orders')
            ->orderBy('created_at', 'DESC')->limit(15)->get()->getResultArray();

        // --- Top clicked elements (where people click most) ----------------
        $topElements = $db->table('click_events')
            ->select('element_text, element_id, event_name, COUNT(*) AS total')
            ->whereNotIn('event_name', ['heartbeat'])
            ->groupBy('element_text', 'element_id', 'event_name')
            ->orderBy('total', 'DESC')
            ->limit(12)
            ->get()->getResultArray();

        // --- Last 30 days payment-click trend ------------------------------
        $dailyClicks = $db->table('click_events')
            ->select('DATE(created_at) AS day, COUNT(*) AS total')
            ->whereIn('event_name', $paymentButtonEvents)
            ->where('created_at >=', date('Y-m-d 00:00:00', strtotime('-29 days')))
            ->groupBy('DATE(created_at)')
            ->orderBy('day', 'ASC')
            ->get()->getResultArray();

        $dailyOrders = $db->table('orders')
            ->select('DATE(created_at) AS day, COUNT(*) AS total')
            ->where('created_at >=', date('Y-m-d 00:00:00', strtotime('-29 days')))
            ->groupBy('DATE(created_at)')
            ->orderBy('day', 'ASC')
            ->get()->getResultArray();

        $clicksByDay = [];
        foreach ($dailyClicks as $row) {
            $clicksByDay[$row['day']] = (int) $row['total'];
        }
        $ordersByDay = [];
        foreach ($dailyOrders as $row) {
            $ordersByDay[$row['day']] = (int) $row['total'];
        }

        $trend = [];
        for ($i = 29; $i >= 0; $i--) {
            $day = date('Y-m-d', strtotime("-{$i} days"));
            $trend[] = [
                'day'    => $day,
                'clicks' => $clicksByDay[$day] ?? 0,
                'orders' => $ordersByDay[$day] ?? 0,
            ];
        }

        return view('admin/dashboard', [
            'totalVisitors'      => $totalVisitors,
            'todayVisitors'      => $todayVisitors,
            'totalPageViews'     => $totalPageViews,
            'todayPageViews'     => $todayPageViews,
            'totalClicks'        => $totalClicks,
            'paymentClicksTotal' => $paymentClicksTotal,
            'paymentClicksToday' => $paymentClicksToday,
            'clicksByEvent'      => $clicksByEvent,
            'ordersTotal'        => $ordersTotal,
            'ordersPaid'         => $ordersPaid,
            'ordersToday'        => $ordersToday,
            'revenueRupees'      => number_format($revenuePaise / 100, 2),
            'funnel'             => $funnel,
            'recentOrders'       => $recentOrders,
            'topElements'        => $topElements,
            'trend'              => $trend,
            'funnelEvents'       => $funnelEvents,
        ]);
    }

    /**
     * GET /admin/clicks
     * Full click log with filters (event type, search, pagination).
     */
    public function clicks()
    {
        $db = \Config\Database::connect();

        $funnelEvents = ClickEventModel::CHECKOUT_FUNNEL_EVENTS;

        $page   = max(1, (int) ($this->request->getGet('page') ?? 1));
        $perPage = 40;
        $event  = trim((string) ($this->request->getGet('event') ?? ''));
        $search = trim((string) ($this->request->getGet('q') ?? ''));

        $builder = $db->table('click_events');
        if ($event !== '') {
            $builder->where('event_name', $event);
        }
        if ($search !== '') {
            $builder->groupStart()
                ->like('element_text', $search)
                ->orLike('page_url', $search)
                ->orLike('visitor_id', $search)
                ->groupEnd();
        }

        $totalRows = (int) $builder->countAllResults(false);
        $clicks = $builder->orderBy('id', 'DESC')
            ->limit($perPage, ($page - 1) * $perPage)
            ->get()->getResultArray();

        // Distinct event names for the filter dropdown
        $eventNames = $db->table('click_events')
            ->select('event_name, COUNT(*) AS total')
            ->groupBy('event_name')->orderBy('total', 'DESC')
            ->get()->getResultArray();

        return view('admin/clicks', [
            'clicks'      => $clicks,
            'eventNames'  => $eventNames,
            'totalRows'   => $totalRows,
            'page'        => $page,
            'perPage'     => $perPage,
            'event'       => $event,
            'search'      => $search,
            'paymentEvents' => $funnelEvents,
        ]);
    }

    /**
     * GET /admin/orders
     * Order list with status filter.
     */
    public function orders()
    {
        $db = \Config\Database::connect();

        $page    = max(1, (int) ($this->request->getGet('page') ?? 1));
        $perPage = 30;
        $status  = trim((string) ($this->request->getGet('status') ?? ''));

        $builder = $db->table('orders');
        if ($status !== '' && in_array($status, ['created', 'paid', 'failed', 'refunded'], true)) {
            $builder->where('status', $status);
        }

        $totalRows = (int) $builder->countAllResults(false);
        $orders = $builder->orderBy('id', 'DESC')
            ->limit($perPage, ($page - 1) * $perPage)
            ->get()->getResultArray();

        $revenuePaise = (int) ($db->table('orders')->selectSum('amount')->where('status', 'paid')->get()->getRow()->amount ?? 0);

        return view('admin/orders', [
            'orders'       => $orders,
            'totalRows'    => $totalRows,
            'page'         => $page,
            'perPage'      => $perPage,
            'status'       => $status,
            'revenueRupees'=> number_format($revenuePaise / 100, 2),
        ]);
    }

    /**
     * GET /admin/visitors
     * Visitor list with page-view and click counts.
     */
    public function visitors()
    {
        $db = \Config\Database::connect();

        $page    = max(1, (int) ($this->request->getGet('page') ?? 1));
        $perPage = 40;

        $totalRows = (int) $db->table('visitors')->countAllResults();

        $visitors = $db->table('visitors')
            ->select('visitors.*, 
                      (SELECT COUNT(*) FROM page_views WHERE page_views.visitor_id = visitors.visitor_id) AS views,
                      (SELECT COUNT(*) FROM click_events WHERE click_events.visitor_id = visitors.visitor_id) AS clicks')
            ->orderBy('last_seen_at', 'DESC')
            ->limit($perPage, ($page - 1) * $perPage)
            ->get()->getResultArray();

        return view('admin/visitors', [
            'visitors'   => $visitors,
            'totalRows'  => $totalRows,
            'page'       => $page,
            'perPage'    => $perPage,
        ]);
    }

    // ------------------------------------------------------------------

    private function countEvent($eventName): int
    {
        $db = \Config\Database::connect();
        $builder = $db->table('click_events');

        if (is_array($eventName)) {
            $builder->whereIn('event_name', $eventName);
        } else {
            $builder->where('event_name', $eventName);
        }

        return (int) $builder->countAllResults();
    }
}
