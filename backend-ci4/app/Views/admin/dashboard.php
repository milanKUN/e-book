<?= $this->include('admin/partials/header', ['pageTitle' => 'Dashboard', 'active' => 'dashboard']) ?>

<div class="topbar">
  <div>
    <h1>Dashboard</h1>
    <div class="sub">Click behaviour, payment clicks & orders — live from the database.</div>
  </div>
  <div class="userchip"><span class="dot"></span> Live tracking on</div>
</div>

<!-- KPI cards -->
<div class="cards c4">
  <div class="card">
    <div class="lbl">Payment Button Clicks</div>
    <div class="val orange"><?= number_format($paymentClicksTotal) ?></div>
    <div class="hint"><?= number_format($paymentClicksToday) ?> today</div>
  </div>
  <div class="card">
    <div class="lbl">Orders Created</div>
    <div class="val blue"><?= number_format($ordersTotal) ?></div>
    <div class="hint"><?= number_format($ordersToday) ?> today</div>
  </div>
  <div class="card">
    <div class="lbl">Paid Orders</div>
    <div class="val green"><?= number_format($ordersPaid) ?></div>
    <div class="hint"><?= $ordersTotal > 0 ? round(($ordersPaid / max(1, $ordersTotal)) * 100, 1) : 0 ?>% conversion</div>
  </div>
  <div class="card">
    <div class="lbl">Revenue</div>
    <div class="val gold">₹<?= $revenueRupees ?></div>
    <div class="hint">from successful payments</div>
  </div>
</div>

<div class="cards c4">
  <div class="card">
    <div class="lbl">Total Visitors</div>
    <div class="val"><?= number_format($totalVisitors) ?></div>
    <div class="hint"><?= number_format($todayVisitors) ?> new today</div>
  </div>
  <div class="card">
    <div class="lbl">Page Views</div>
    <div class="val"><?= number_format($totalPageViews) ?></div>
    <div class="hint"><?= number_format($todayPageViews) ?> today</div>
  </div>
  <div class="card">
    <div class="lbl">Total Clicks Tracked</div>
    <div class="val"><?= number_format($totalClicks) ?></div>
    <div class="hint">all elements & buttons</div>
  </div>
  <div class="card">
    <div class="lbl">Click-to-Order Rate</div>
    <div class="val orange"><?= $paymentClicksTotal > 0 ? round(($ordersTotal / max(1, $paymentClicksTotal)) * 100, 1) : 0 ?>%</div>
    <div class="hint">orders ÷ payment clicks</div>
  </div>
</div>

<!-- Payment clicks by event type -->
<div class="panel">
  <h2>Checkout Funnel — clicks by event <span class="badge">"kato bar click hoche"</span></h2>
  <?php if (empty($clicksByEvent)): ?>
    <div class="empty">No checkout-related clicks recorded yet. They will appear as soon as visitors click the buy/pay buttons.</div>
  <?php else: ?>
    <table>
      <thead><tr><th>Funnel Step</th><th>Count</th><th>Unique Visitors</th></tr></thead>
      <tbody>
      <?php
        $stepLabels = [
            'checkout_start'  => 'Payment button clicked (BUY NOW / GET)',
            'form_submit'     => 'Checkout form submitted (PAY)',
            'order_created'   => 'Razorpay order created',
            'payment_success' => 'Payment completed',
        ];
        foreach ($clicksByEvent as $row):
      ?>
        <tr>
          <td><span class="pill hot"><?= esc($row['event_name']) ?></span>
              <span style="color:var(--muted);font-size:12px;margin-left:8px"><?= esc($stepLabels[$row['event_name']] ?? '') ?></span></td>
          <td><strong><?= number_format((int) $row['total']) ?></strong></td>
          <td><?= number_format((int) $row['unique_visitors']) ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
    <div style="margin-top:12px"><a href="/admin/clicks?event=checkout_start" style="color:var(--orange);font-size:13px">View full click log →</a></div>
  <?php endif; ?>
</div>

<!-- Conversion funnel -->
<div class="panel">
  <h2>Conversion Funnel</h2>
  <?php
    $maxFunnel = max(1, $funnel['visited']);
    $funnelSteps = [
        ['Visited site',        $funnel['visited'],         '#38bdf8'],
        ['Clicked Buy Now',     $funnel['clicked_buy'],     '#8b5cf6'],
        ['Opened Checkout',     $funnel['opened_checkout'], '#FF5A0A'],
        ['Order Created',       $funnel['orders_created'],  '#F3C64D'],
        ['Payment Completed',   $funnel['orders_paid'],     '#22c55e'],
    ];
  ?>
  <div class="funnel">
    <?php foreach ($funnelSteps as [$label, $value, $color]): ?>
      <div class="funnel-row">
        <div class="fl"><?= esc($label) ?></div>
        <div class="funnel-bar">
          <div class="funnel-fill" style="width:<?= max(4, ($value / $maxFunnel) * 100) ?>%;background:<?= $color ?>"><?= number_format($value) ?></div>
        </div>
        <div class="fv"><?= number_format($value) ?></div>
      </div>
    <?php endforeach; ?>
  </div>
</div>

<!-- Trend: payment clicks vs orders (last 30 days) -->
<div class="panel">
  <h2>Last 30 Days — Payment Clicks (orange) vs Orders (green)</h2>
  <?php
    $maxTrend = 1;
    foreach ($trend as $t) { $maxTrend = max($maxTrend, $t['clicks'], $t['orders']); }
  ?>
  <div class="trend">
    <?php foreach ($trend as $t): ?>
      <div class="col">
        <div class="bar" style="height:<?= ($t['clicks'] / $maxTrend) * 100 ?>%" title="<?= esc($t['day']) ?>: <?= $t['clicks'] ?> clicks"></div>
        <div class="bar orders" style="height:<?= ($t['orders'] / $maxTrend) * 100 ?>%" title="<?= esc($t['day']) ?>: <?= $t['orders'] ?> orders"></div>
        <div class="d"><?= date('d', strtotime($t['day'])) ?></div>
      </div>
    <?php endforeach; ?>
  </div>
</div>

<!-- Top clicked elements: "ke kothay click korche" -->
<div class="panel">
  <h2>Where Users Click Most <span class="badge">"ke kothay click korche"</span></h2>
  <?php if (empty($topElements)): ?>
    <div class="empty">No clicks recorded yet.</div>
  <?php else: ?>
    <table>
      <thead><tr><th>Element Text</th><th>Element ID</th><th>Event</th><th>Clicks</th></tr></thead>
      <tbody>
      <?php foreach ($topElements as $el): ?>
        <tr>
          <td><?= esc($el['element_text'] !== '' ? $el['element_text'] : '—') ?></td>
          <td class="mono"><?= esc($el['element_id'] !== '' ? $el['element_id'] : '—') ?></td>
          <td><span class="pill <?= in_array($el['event_name'], $funnelEvents, true) ? 'hot' : 'created' ?>"><?= esc($el['event_name']) ?></span></td>
          <td><strong><?= number_format((int) $el['total']) ?></strong></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>
</div>

<!-- Recent orders -->
<div class="panel">
  <h2>Recent Orders <a href="/admin/orders" style="margin-left:auto;color:var(--orange);font-size:13px;font-weight:600">All orders →</a></h2>
  <?php if (empty($recentOrders)): ?>
    <div class="empty">No orders yet.</div>
  <?php else: ?>
    <table>
      <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>When</th></tr></thead>
      <tbody>
      <?php foreach ($recentOrders as $o): ?>
        <tr>
          <td class="mono wrap"><?= esc($o['razorpay_order_id']) ?></td>
          <td><?= esc($o['customer_name']) ?><br><span style="color:var(--muted);font-size:12px"><?= esc($o['customer_email']) ?></span></td>
          <td>₹<?= number_format($o['amount'] / 100, 2) ?></td>
          <td><span class="pill <?= esc($o['status']) ?>"><?= esc($o['status']) ?></span></td>
          <td style="color:var(--muted);font-size:12px"><?= esc($o['created_at']) ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>
</div>

<?= $this->include('admin/partials/footer') ?>
