<?= $this->include('admin/partials/header', ['pageTitle' => 'Visitors', 'active' => 'visitors']) ?>

<div class="topbar">
  <div>
    <h1>Visitors</h1>
    <div class="sub"><?= number_format($totalRows) ?> unique visitors tracked.</div>
  </div>
</div>

<div class="panel">
  <h2>Recent Visitors</h2>
  <?php if (empty($visitors)): ?>
    <div class="empty">No visitors recorded yet.</div>
  <?php else: ?>
    <table>
      <thead>
        <tr>
          <th>Visitor ID</th>
          <th>IP</th>
          <th>Views</th>
          <th>Clicks</th>
          <th>First Seen</th>
          <th>Last Seen</th>
        </tr>
      </thead>
      <tbody>
      <?php foreach ($visitors as $v): ?>
        <tr>
          <td class="mono"><?= esc(substr($v['visitor_id'], 0, 14)) ?>…</td>
          <td class="mono"><?= esc($v['ip_address'] ?? '—') ?></td>
          <td><?= number_format((int) $v['views']) ?></td>
          <td><?= number_format((int) $v['clicks']) ?></td>
          <td style="color:var(--muted);font-size:12px;white-space:nowrap"><?= esc($v['first_seen_at']) ?></td>
          <td style="color:var(--muted);font-size:12px;white-space:nowrap"><?= esc($v['last_seen_at']) ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>

    <?php $totalPages = (int) ceil($totalRows / $perPage); ?>
    <?php if ($totalPages > 1): ?>
      <div class="pager">
        <?php if ($page > 1): ?><a href="/admin/visitors?page=<?= $page - 1 ?>">← Prev</a><?php endif; ?>
        <?php for ($i = max(1, $page - 4); $i <= min($totalPages, $page + 4); $i++): ?>
          <?php if ($i === $page): ?><span class="cur"><?= $i ?></span><?php else: ?><a href="/admin/visitors?page=<?= $i ?>"><?= $i ?></a><?php endif; ?>
        <?php endfor; ?>
        <?php if ($page < $totalPages): ?><a href="/admin/visitors?page=<?= $page + 1 ?>">Next →</a><?php endif; ?>
      </div>
    <?php endif; ?>
  <?php endif; ?>
</div>

<?= $this->include('admin/partials/footer') ?>
