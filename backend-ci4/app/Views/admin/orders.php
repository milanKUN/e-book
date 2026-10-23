<?= $this->include('admin/partials/header', ['pageTitle' => 'Orders', 'active' => 'orders']) ?>

<div class="topbar">
  <div>
    <h1>Orders & Payments</h1>
    <div class="sub">Razorpay orders — <?= number_format($totalRows) ?> total · Revenue: <strong style="color:var(--gold)">₹<?= $revenueRupees ?></strong></div>
  </div>
</div>

<div class="panel">
  <h2>Filter</h2>
  <form class="filters" method="get" action="/admin/orders">
    <select name="status">
      <option value="">All statuses</option>
      <?php foreach (['created', 'paid', 'failed', 'refunded'] as $s): ?>
        <option value="<?= $s ?>" <?= $status === $s ? 'selected' : '' ?>><?= ucfirst($s) ?></option>
      <?php endforeach; ?>
    </select>
    <button type="submit">Apply</button>
    <?php if ($status !== ''): ?><a class="clear" href="/admin/orders">Clear</a><?php endif; ?>
  </form>

  <?php if (empty($orders)): ?>
    <div class="empty">No orders match this filter.</div>
  <?php else: ?>
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Payment ID</th>
          <th>Method</th>
          <th>When</th>
        </tr>
      </thead>
      <tbody>
      <?php foreach ($orders as $o): ?>
        <tr>
          <td class="mono wrap"><?= esc($o['razorpay_order_id']) ?></td>
          <td>
            <?= esc($o['customer_name']) ?><br>
            <span style="color:var(--muted);font-size:12px"><?= esc($o['customer_email']) ?><?= $o['customer_phone'] ? ' · ' . esc($o['customer_phone']) : '' ?></span>
          </td>
          <td><strong>₹<?= number_format($o['amount'] / 100, 2) ?></strong></td>
          <td><span class="pill <?= esc($o['status']) ?>"><?= esc($o['status']) ?></span></td>
          <td class="mono wrap" style="font-size:11px"><?= esc($o['razorpay_payment_id'] ?? '—') ?></td>
          <td><?= esc($o['method'] ?? '—') ?></td>
          <td style="color:var(--muted);font-size:12px;white-space:nowrap"><?= esc($o['created_at']) ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>

    <?php
      $totalPages = (int) ceil($totalRows / $perPage);
      $qs = $status !== '' ? '?status=' . urlencode($status) : '';
    ?>
    <?php if ($totalPages > 1): ?>
      <div class="pager">
        <?php if ($page > 1): ?><a href="/admin/orders?page=<?= $page - 1 . ($status !== '' ? '&status=' . urlencode($status) : '') ?>">← Prev</a><?php endif; ?>
        <?php for ($i = max(1, $page - 4); $i <= min($totalPages, $page + 4); $i++): ?>
          <?php if ($i === $page): ?><span class="cur"><?= $i ?></span><?php else: ?><a href="/admin/orders?page=<?= $i . ($status !== '' ? '&status=' . urlencode($status) : '') ?>"><?= $i ?></a><?php endif; ?>
        <?php endfor; ?>
        <?php if ($page < $totalPages): ?><a href="/admin/orders?page=<?= $page + 1 . ($status !== '' ? '&status=' . urlencode($status) : '') ?>">Next →</a><?php endif; ?>
      </div>
    <?php endif; ?>
  <?php endif; ?>
</div>

<?= $this->include('admin/partials/footer') ?>
