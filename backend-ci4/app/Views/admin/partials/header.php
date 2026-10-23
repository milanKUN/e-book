<?php
/**
 * Admin layout header — shared sidebar + design system.
 * Expects optional $pageTitle.
 */
$pageTitle = $pageTitle ?? 'Admin';
$active    = $active ?? '';
$adminName = session()->get('admin_name') ?? 'Admin';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= esc($pageTitle) ?> · Guru Netra Admin</title>
<style>
:root{
  --bg:#0B1720; --bg2:#0e1d29; --panel:#122433; --panel2:#0d1a24;
  --line:rgba(255,255,255,.08); --txt:#e9f0f4; --muted:#8ba0ae;
  --orange:#FF5A0A; --gold:#F3C64D; --green:#22c55e; --red:#ef4444; --blue:#38bdf8;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--txt);min-height:100vh}
a{color:inherit;text-decoration:none}

.layout{display:flex;min-height:100vh}
.sidebar{width:230px;background:var(--panel2);border-right:1px solid var(--line);padding:24px 14px;position:fixed;top:0;bottom:0;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:10px;padding:0 8px 22px;border-bottom:1px solid var(--line);margin-bottom:18px}
.brand-badge{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,var(--orange),var(--gold));display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:15px}
.brand-name{font-weight:800;font-size:15px;letter-spacing:.5px}
.brand-sub{font-size:11px;color:var(--muted)}
.nav{display:flex;flex-direction:column;gap:4px}
.nav a{display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:10px;font-size:14px;color:var(--muted);transition:.15s}
.nav a:hover{background:rgba(255,255,255,.05);color:var(--txt)}
.nav a.active{background:linear-gradient(90deg,rgba(255,90,10,.18),rgba(255,90,10,.04));color:#fff;border-left:3px solid var(--orange)}
.nav .ico{width:18px;text-align:center}
.sidebar-foot{margin-top:auto;padding:14px 8px 0;border-top:1px solid var(--line);font-size:12px;color:var(--muted)}
.sidebar-foot a{color:var(--orange)}

.main{flex:1;margin-left:230px;padding:28px 32px;max-width:1400px}
.topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:26px}
.topbar h1{font-size:22px;font-weight:800}
.topbar .sub{font-size:13px;color:var(--muted);margin-top:3px}
.userchip{display:flex;align-items:center;gap:10px;background:var(--panel);border:1px solid var(--line);padding:8px 14px;border-radius:10px;font-size:13px}
.userchip .dot{width:8px;height:8px;border-radius:50%;background:var(--green)}

/* Cards */
.cards{display:grid;gap:14px;margin-bottom:24px}
.cards.c4{grid-template-columns:repeat(4,1fr)}
.cards.c3{grid-template-columns:repeat(3,1fr)}
.cards.c5{grid-template-columns:repeat(5,1fr)}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px 20px}
.card .lbl{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.6px}
.card .val{font-size:26px;font-weight:800;margin-top:6px}
.card .val.orange{color:var(--orange)} .card .val.gold{color:var(--gold)}
.card .val.green{color:var(--green)} .card .val.blue{color:var(--blue)}
.card .hint{font-size:12px;color:var(--muted);margin-top:4px}

.panel{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:20px 22px;margin-bottom:22px}
.panel h2{font-size:15px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.panel h2 .badge{font-size:11px;background:rgba(255,90,10,.15);color:var(--orange);padding:3px 9px;border-radius:100px;font-weight:600}

/* Table */
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:10px 12px;color:var(--muted);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--line)}
td{padding:11px 12px;border-bottom:1px solid rgba(255,255,255,.04);vertical-align:top}
tr:hover td{background:rgba(255,255,255,.02)}
.mono{font-family:ui-monospace,Consolas,monospace;font-size:12px}
.wrap{word-break:break-all;max-width:280px}
.pill{display:inline-block;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:700}
.pill.paid{background:rgba(34,197,94,.15);color:var(--green)}
.pill.created{background:rgba(56,189,248,.15);color:var(--blue)}
.pill.failed{background:rgba(239,68,68,.15);color:var(--red)}
.pill.refunded{background:rgba(243,198,77,.15);color:var(--gold)}
.pill.hot{background:rgba(255,90,10,.15);color:var(--orange)}

/* Filters */
.filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;align-items:center}
.filters input,.filters select{background:var(--panel2);border:1px solid var(--line);color:var(--txt);padding:9px 13px;border-radius:9px;font-size:13px}
.filters input:focus,.filters select:focus{outline:none;border-color:var(--orange)}
.filters button{background:var(--orange);border:none;color:#fff;padding:9px 18px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer}
.filters a.clear{font-size:12px;color:var(--muted)}

/* Funnel */
.funnel{display:flex;flex-direction:column;gap:10px}
.funnel-row{display:flex;align-items:center;gap:14px}
.funnel-row .fl{width:130px;font-size:13px;color:var(--muted);text-align:right}
.funnel-bar{flex:1;height:32px;background:var(--panel2);border-radius:8px;overflow:hidden;position:relative}
.funnel-fill{height:100%;border-radius:8px;display:flex;align-items:center;padding-left:12px;font-size:12px;font-weight:700;color:#fff;min-width:fit-content}
.funnel-row .fv{width:70px;font-size:14px;font-weight:700}

/* Pagination */
.pager{display:flex;gap:6px;margin-top:16px;flex-wrap:wrap}
.pager a,.pager span{padding:7px 12px;border-radius:8px;font-size:13px;background:var(--panel2);border:1px solid var(--line);color:var(--muted)}
.pager a:hover{border-color:var(--orange);color:var(--txt)}
.pager .cur{background:var(--orange);color:#fff;border-color:var(--orange);font-weight:700}

/* Trend (simple bars) */
.trend{display:flex;align-items:flex-end;gap:3px;height:120px}
.trend .col{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:3px;height:100%}
.trend .bar{width:100%;background:linear-gradient(180deg,var(--orange),rgba(255,90,10,.4));border-radius:3px 3px 0 0;min-height:2px}
.trend .bar.orders{background:linear-gradient(180deg,var(--green),rgba(34,197,94,.4))}
.trend .d{font-size:9px;color:var(--muted);white-space:nowrap}

.empty{padding:34px;text-align:center;color:var(--muted);font-size:14px}

@media(max-width:1100px){.cards.c5{grid-template-columns:repeat(3,1fr)}.cards.c4{grid-template-columns:repeat(2,1fr)}}
@media(max-width:760px){.sidebar{display:none}.main{margin-left:0;padding:18px}.cards.c4,.cards.c3,.cards.c5{grid-template-columns:1fr 1fr}}
</style>
</head>
<body>
<div class="layout">
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-badge">GN</div>
      <div>
        <div class="brand-name">GURU NETRA</div>
        <div class="brand-sub">Admin Panel</div>
      </div>
    </div>
    <nav class="nav">
      <a href="/admin" class="<?= $active === 'dashboard' ? 'active' : '' ?>"><span class="ico">▦</span> Dashboard</a>
      <a href="/admin/clicks" class="<?= $active === 'clicks' ? 'active' : '' ?>"><span class="ico">🖱</span> Click Analytics</a>
      <a href="/admin/orders" class="<?= $active === 'orders' ? 'active' : '' ?>"><span class="ico">💳</span> Orders & Payments</a>
      <a href="/admin/visitors" class="<?= $active === 'visitors' ? 'active' : '' ?>"><span class="ico">👥</span> Visitors</a>
      <a href="/admin/settings" class="<?= $active === 'settings' ? 'active' : '' ?>"><span class="ico">⚙️</span> Settings</a>
    </nav>
    <div class="sidebar-foot">
      Logged in as <strong><?= esc($adminName) ?></strong><br>
      <a href="/admin/logout">Logout →</a>
    </div>
  </aside>
  <main class="main">
