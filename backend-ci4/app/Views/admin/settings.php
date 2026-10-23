<?= $this->include('admin/partials/header', ['pageTitle' => 'Settings', 'active' => 'settings']) ?>

<div class="topbar">
  <div>
    <h1>Store Settings</h1>
    <div class="sub">Change the ebook price — the website and Razorpay checkout both update instantly.</div>
  </div>
</div>

<?php if (! empty($saved)): ?>
  <div class="panel" style="border-color:rgba(34,197,94,.4);background:rgba(34,197,94,.08)">
    <h2 style="color:var(--green)">✅ Price saved successfully</h2>
    <div style="font-size:13px;color:var(--muted)">
      The new price is live. Website visitors see it right away (their browser may cache the old price for up to 5 minutes).
      New Razorpay orders will be created with this amount.
    </div>
  </div>
<?php endif; ?>

<?php if (! empty($error)): ?>
  <div class="panel" style="border-color:rgba(239,68,68,.4);background:rgba(239,68,68,.08)">
    <h2 style="color:var(--red)">⚠️ Could not save</h2>
    <div style="font-size:13px;color:var(--muted)"><?= esc($error) ?></div>
  </div>
<?php endif; ?>

<div class="cards c3">
  <div class="card">
    <div class="lbl">Current selling price</div>
    <div class="val orange">₹<?= esc($ebookPrice) ?></div>
    <div class="hint">Charged on Razorpay at checkout</div>
  </div>
  <div class="card">
    <div class="lbl">Original / MRP price</div>
    <div class="val">₹<?= esc($origPrice ?? '—') ?></div>
    <div class="hint">Shown struck-through on the site</div>
  </div>
  <div class="card">
    <div class="lbl">Razorpay order amount</div>
    <div class="val gold"><?= (int) round(((float) $ebookPrice) * 100) ?> paise</div>
    <div class="hint">₹<?= esc($ebookPrice) ?> × 100 — sent to Razorpay</div>
  </div>
</div>

<div class="panel">
  <h2>✏️ Edit Price <span class="badge">live</span></h2>
  <form method="post" action="/admin/settings" style="max-width:520px;display:flex;flex-direction:column;gap:16px">
    <div>
      <label style="display:block;font-size:13px;color:var(--muted);margin-bottom:6px">Selling price (₹) — what customers pay</label>
      <input
        type="number" name="ebook_price" min="1" max="100000" step="0.5" required
        value="<?= esc($ebookPrice) ?>"
        style="width:100%;background:var(--panel2);border:1px solid var(--line);color:var(--txt);padding:11px 14px;border-radius:9px;font-size:16px;font-weight:700"
      >
      <div style="font-size:12px;color:var(--muted);margin-top:6px">
        Minimum ₹1 (Razorpay limit). Examples: 99 · 149 · 49.50
      </div>
    </div>

    <div>
      <label style="display:block;font-size:13px;color:var(--muted);margin-bottom:6px">Original / MRP price (₹) — shown with a strike-through</label>
      <input
        type="number" name="original_price" min="0" max="1000000" step="0.5"
        value="<?= esc($origPrice ?? '') ?>"
        style="width:100%;background:var(--panel2);border:1px solid var(--line);color:var(--txt);padding:11px 14px;border-radius:9px;font-size:15px"
      >
      <div style="font-size:12px;color:var(--muted);margin-top:6px">
        Used for the "90% OFF" style discount badge (discount % is calculated automatically).
      </div>
    </div>

    <div style="display:flex;gap:10px;align-items:center">
      <button type="submit" style="background:var(--orange);border:none;color:#fff;padding:11px 26px;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer">
        Save Price
      </button>
      <span style="font-size:12px;color:var(--muted)">Website visitors see the new price immediately.</span>
    </div>
  </form>
</div>

<?php if (! empty($uploaded)): ?>
  <div class="panel" style="border-color:rgba(34,197,94,.4);background:rgba(34,197,94,.08)">
    <h2 style="color:var(--green)">✅ Ebook file updated</h2>
    <div style="font-size:13px;color:var(--muted)">
      New file saved. Every customer who pays from now on will receive <strong>this</strong> file.
    </div>
  </div>
<?php endif; ?>

<div class="panel">
  <h2>📘 Ebook File — what customers download <span class="badge">after payment</span></h2>

  <?php if (! empty($ebook)): ?>
    <div class="cards c3" style="margin-bottom:16px">
      <div class="card">
        <div class="lbl">Current file</div>
        <div class="val" style="font-size:15px;word-break:break-all;margin-top:8px"><?= esc($ebook['original_name']) ?></div>
      </div>
      <div class="card">
        <div class="lbl">Size</div>
        <div class="val gold" style="font-size:20px"><?= $ebook['file_size'] >= 1048576
            ? number_format($ebook['file_size'] / 1048576, 2) . ' MB'
            : number_format(max(1, $ebook['file_size'] / 1024), 1) . ' KB' ?></div>
      </div>
      <div class="card">
        <div class="lbl">Uploaded</div>
        <div class="val" style="font-size:16px;margin-top:8px"><?= esc($ebook['created_at'] ?? '—') ?></div>
      </div>
    </div>
  <?php else: ?>
    <div class="panel" style="border-color:rgba(243,198,77,.4);background:rgba(243,198,77,.08);margin-bottom:16px">
      <h2 style="color:var(--gold)">⚠️ No file uploaded yet</h2>
      <div style="font-size:13px;color:var(--muted)">
        Until you upload a PDF here, paid customers are redirected to the old
        <span class="mono">EBOOK_GOOGLE_DRIVE_URL</span> link from the server config.
      </div>
    </div>
  <?php endif; ?>

  <form method="post" action="/admin/settings/upload-ebook" enctype="multipart/form-data"
        style="display:flex;flex-direction:column;gap:14px;max-width:560px">
    <div>
      <label style="display:block;font-size:13px;color:var(--muted);margin-bottom:6px">Choose a new PDF (replaces the current file)</label>
      <input type="file" name="ebook_file" accept="application/pdf,.pdf" required
             style="width:100%;background:var(--panel2);border:1px dashed rgba(255,255,255,.2);color:var(--txt);padding:14px;border-radius:9px;font-size:13px">
      <div style="font-size:12px;color:var(--muted);margin-top:6px">
        PDF only · max 48 MB · stored on the server (not public — served only after verified payment)
      </div>
    </div>
    <div style="display:flex;gap:10px;align-items:center">
      <button type="submit" style="background:var(--green);border:none;color:#fff;padding:11px 26px;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer">
        Upload Ebook
      </button>
      <span style="font-size:12px;color:var(--muted)">Paying customers get the new file immediately.</span>
    </div>
  </form>
</div>

<div class="panel">
  <h2>ℹ️ How it works</h2>
  <ul style="font-size:13px;color:var(--muted);line-height:2;padding-left:18px">
    <li>The website fetches the price from <span class="mono">GET /api/settings</span> — nothing is hardcoded on the frontend.</li>
    <li>Razorpay orders are created with the <strong>server-side</strong> price from this page, so customers can never pay a manipulated amount.</li>
    <li>After payment, the customer's download button calls <span class="mono">/api/payments/download</span>, which checks the payment token <em>and</em> a paid order before sending the uploaded PDF.</li>
    <li>Uploading a new PDF replaces the old one for all future downloads — past orders can still download the latest file.</li>
    <li>Old orders keep their original amount — changing the price never affects past payments.</li>
  </ul>
</div>

<?= $this->include('admin/partials/footer') ?>
