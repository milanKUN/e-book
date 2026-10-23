<?= $this->include('admin/partials/header', ['pageTitle' => 'Click Analytics', 'active' => 'clicks']) ?>

<div class="topbar">
  <div>
    <h1>Click Analytics</h1>
    <div class="sub">Ke kothay click korche — full click log (<?= number_format($totalRows) ?> records).</div>
  </div>
</div>

<div class="panel">
  <h2>Filter</h2>
  <form class="filters" method="get" action="/admin/clicks">
    <select name="event">
      <option value="">All events</option>
      <?php foreach ($eventNames as $en): ?>
        <option value="<?= esc($en['event_name']) ?>" <?= $event === $en['event_name'] ? 'selected' : '' ?>>
          <?= esc($en['event_name']) ?> (<?= number_format((int) $en['total']) ?>)
        </option>
      <?php endforeach; ?>
    </select>
    <input type="text" name="q" placeholder="Search element text / url / visitor…" value="<?= esc($search) ?>">
    <button type="submit">Apply</button>
    <?php if ($event !== '' || $search !== ''): ?><a class="clear" href="/admin/clicks">Clear</a><?php endif; ?>
  </form>

  <?php if (empty($clicks)): ?>
    <div class="empty">No clicks match this filter.</div>
  <?php else: ?>
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Event</th>
          <th>Element</th>
          <th>Page</th>
          <th>Visitor</th>
        </tr>
      </thead>
      <tbody>
      <?php foreach ($clicks as $c): ?>
        <?php $isPay = in_array($c['event_name'], $paymentEvents, true); ?>
        <tr>
          <td style="white-space:nowrap;color:var(--muted);font-size:12px"><?= esc($c['created_at']) ?></td>
          <td><span class="pill <?= $isPay ? 'hot' : 'created' ?>"><?= esc($c['event_name']) ?></span></td>
          <td>
            <?php if ($c['element_text'] !== ''): ?><strong><?= esc($c['element_text']) ?></strong><br><?php endif; ?>
            <span class="mono" style="color:var(--muted)"><?= esc($c['element_id'] !== '' ? '#' . $c['element_id'] : ($c['tag'] !== '' ? '<' . $c['tag'] . '>' : '—')) ?></span>
          </td>
          <td class="wrap" style="font-size:11px;color:var(--muted)"><?= esc($c['page_url']) ?></td>
          <td class="mono" style="font-size:11px"><?= esc(substr($c['visitor_id'], 0, 10)) ?>…</td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>

    <?php
      $totalPages = (int) ceil($totalRows / $perPage);
      $qs = http_build_query(array_filter(['event' => $event, 'q' => $search]));
      $qs = $qs !== '' ? '&' . $qs : '';
    ?>
    <?php if ($totalPages > 1): ?>
      <div class="pager">
        <?php if ($page > 1): ?><a href="/admin/clicks?page=<?= $page - 1 . $qs ?>">← Prev</a><?php endif; ?>
        <?php
          $start = max(1, $page - 4);
          $end   = min($totalPages, $page + 4);
          for ($i = $start; $i <= $end; $i++):
        ?>
          <?php if ($i === $page): ?><span class="cur"><?= $i ?></span><?php else: ?><a href="/admin/clicks?page=<?= $i . $qs ?>"><?= $i ?></a><?php endif; ?>
        <?php endfor; ?>
        <?php if ($page < $totalPages): ?><a href="/admin/clicks?page=<?= $page + 1 . $qs ?>">Next →</a><?php endif; ?>
      </div>
    <?php endif; ?>
  <?php endif; ?>
</div>

<?= $this->include('admin/partials/footer') ?>
