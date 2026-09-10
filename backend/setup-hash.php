<?php
// backend/setup-hash.php
// Delete this file after you generate your hash!

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    if (trim($password) !== '') {
        $hash = password_hash($password, PASSWORD_DEFAULT);
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Admin Password Hash Generator</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #1e1e1e; color: white; padding: 40px; }
        .container { max-width: 600px; margin: 0 auto; background: #2c2c2c; padding: 30px; border-radius: 8px; }
        input[type="text"] { width: 100%; padding: 10px; margin: 10px 0; border-radius: 4px; border: 1px solid #444; background: #111; color: white; }
        button { background: #2ecc71; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        .hash-box { background: #111; padding: 15px; margin-top: 20px; border-radius: 4px; word-break: break-all; font-family: monospace; }
        .warning { color: #e74c3c; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Generate Admin Password Hash</h2>
        <p>Enter the secure password you want to use for your Admin Dashboard.</p>
        <form method="POST">
            <input type="text" name="password" placeholder="Enter your new secure password" required>
            <button type="submit">Generate Hash</button>
        </form>

        <?php if (isset($hash)): ?>
            <div class="hash-box">
                <p><strong>Your Password Hash:</strong></p>
                <code style="user-select: all;"><?php echo htmlspecialchars($hash); ?></code>
            </div>
            <div class="warning">
                ⚠️ INSTRUCTIONS:
                <ol>
                    <li>Copy the hash above.</li>
                    <li>Open <code>backend/config/config.php</code> on your Hostinger server.</li>
                    <li>Replace the <code>ADMIN_PASSWORD_HASH</code> value with this new hash.</li>
                    <li><strong>DELETE THIS <code>setup-hash.php</code> FILE FROM YOUR SERVER IMMEDIATELY!</strong></li>
                </ol>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>
