# ChatGPT eBook Analytics Backend

This is the PHP/MySQL backend for the custom analytics tracking system.

## Deployment Instructions

### 1. Database Setup
1. Create a new MySQL database on your server (e.g. `analytics_db`).
2. Open phpMyAdmin or your MySQL client and run the SQL commands found in `database/schema.sql`.

### 2. Upload Files
Upload this entire `backend/` directory to your web server (e.g., inside public_html or similar). It does NOT belong on Netlify.

### 3. Configuration
Rename/update environment variables on your server or edit `config/config.php` directly:
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` (Database credentials)
- `ALLOWED_ORIGIN` (Set to `https://gurunetra.com` in production)
- `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` (For dashboard access)

### 4. Frontend Configuration
In your React/Vite project on Netlify, add this environment variable:
`VITE_ANALYTICS_API_URL=https://your-php-server.com/backend/api`

(If testing locally, you can use `http://localhost/backend/api`).

### Security
Ensure that your database credentials are not exposed and that the PHP server handles HTTPS connections.
