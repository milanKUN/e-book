<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Login · Guru Netra</title>
<style>
:root{--bg:#0B1720;--panel:#122433;--line:rgba(255,255,255,.08);--txt:#e9f0f4;--muted:#8ba0ae;--orange:#FF5A0A;--gold:#F3C64D;--red:#ef4444}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--txt);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.card{width:100%;max-width:380px;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:34px 30px}
.brand{display:flex;align-items:center;gap:12px;margin-bottom:26px;justify-content:center}
.badge{width:46px;height:46px;border-radius:12px;background:linear-gradient(135deg,var(--orange),var(--gold));display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:18px}
h1{font-size:20px;text-align:center}
.sub{font-size:13px;color:var(--muted);text-align:center;margin:6px 0 24px}
label{display:block;font-size:12px;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}
input{width:100%;background:var(--bg);border:1px solid var(--line);color:var(--txt);padding:12px 14px;border-radius:10px;font-size:14px;margin-bottom:16px}
input:focus{outline:none;border-color:var(--orange)}
button{width:100%;background:var(--orange);border:none;color:#fff;padding:13px;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer}
button:hover{filter:brightness(1.08)}
.err{background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);color:#fca5a5;padding:11px 14px;border-radius:10px;font-size:13px;margin-bottom:18px}
.hint{margin-top:18px;font-size:12px;color:var(--muted);text-align:center}
</style>
</head>
<body>
<div class="card">
  <div class="brand">
    <div class="badge">GN</div>
    <div>
      <h1>Admin Login</h1>
      <div class="sub">Guru Netra · Analytics & Payments</div>
    </div>
  </div>

  <?php if (! empty($error)): ?>
    <div class="err"><?= esc($error) ?></div>
  <?php endif; ?>

  <form method="post" action="/admin/login">
    <label for="username">Username</label>
    <input id="username" name="username" type="text" required autofocus autocomplete="username">

    <label for="password">Password</label>
    <input id="password" name="password" type="password" required autocomplete="current-password">

    <button type="submit">Sign In</button>
  </form>

  <div class="hint">Default: admin / Admin@1234 — change it after first login.</div>
</div>
</body>
</html>
