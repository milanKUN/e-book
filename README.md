# Guru Netra - ChatGPT Income Guide

This is the React + Vite frontend for the ChatGPT Income Guide ebook.

## Cashfree + Netlify Ebook Payment Setup

We have implemented a secure, database-free payment verification and digital delivery system using Netlify Serverless Functions and the Cashfree APIs.

### A. Cashfree Credentials
1. Go to your [Cashfree Dashboard](https://merchant.cashfree.com/merchant/login).
2. Navigate to **Payment Gateway > Developers > API Keys**.
3. Generate an App ID and Secret Key. Do this for both **Sandbox** (for testing) and **Production**.

### B. Netlify Environment Variables
In your Netlify Dashboard (Site Settings > Environment Variables), you MUST add the following secrets:

- `CASHFREE_APP_ID`: Your Cashfree App ID
- `CASHFREE_SECRET_KEY`: Your Cashfree Secret Key
- `CASHFREE_ENVIRONMENT`: `sandbox` (for testing) or `production`
- `EBOOK_DOWNLOAD_SECRET`: A long, random secure string (e.g. `gurunetra_secure_jwt_secret_2026!@`). This is used to cryptographically sign the download links.
- `SITE_URL`: Your live site URL (e.g., `https://gurunetra.com`)

> **IMPORTANT:** The `CASHFREE_SECRET_KEY` must remain server-side. It is NEVER exposed to the React frontend or Git repository.

### C. Webhook Configuration
To ensure Cashfree can securely notify the backend of successful payments, configure the webhook in the Cashfree dashboard:

- **Webhook URL:** `https://gurunetra.com/.netlify/functions/cashfree-webhook`
- **Required Events:** `PAYMENT_SUCCESS_WEBHOOK`, `PAYMENT_FAILED_WEBHOOK`
- Ensure you have correctly configured the `CASHFREE_SECRET_KEY` in Netlify, as the webhook handler strictly verifies the cryptographic signature (`x-webhook-signature`) of every request to prevent spoofing.

### D. Sandbox Testing
1. Set `CASHFREE_ENVIRONMENT=sandbox` in Netlify.
2. Ensure you are using Sandbox API Keys.
3. Click "BUY NOW" on the live site.
4. Complete the payment using Cashfree's test UPI or card details.
5. You should be redirected to `/payment-success`, where the server verifies the payment and provides a secure download link.

### E. Production Deployment
1. Change `CASHFREE_ENVIRONMENT` to `production` in Netlify.
2. Swap the App ID and Secret Key to your Production API Keys.
3. Ensure the `SITE_URL` is exactly `https://gurunetra.com`.
4. Trigger a new deploy in Netlify.

### F. Ebook File Configuration
Currently, there is a placeholder PDF located at:
`netlify/secure-data/ebook.pdf`

**BEFORE GOING LIVE:** You must replace this file with the actual PDF of your ebook. Do not place the PDF inside the `public/` directory, as that would make it accessible to anyone on the internet. Netlify is configured to securely bundle the `netlify/secure-data/` folder into the serverless backend.

### G. Secure Download Behavior
When a customer lands on the Success page:
1. React sends the `order_id` to the Netlify `verify-cashfree-payment` backend.
2. The backend directly asks Cashfree if the order was paid.
3. If paid, the backend uses `EBOOK_DOWNLOAD_SECRET` to sign a short-lived JSON Web Token (valid for 60 minutes).
4. The customer clicks "Download Ebook", passing the token to `secure-ebook-download.mjs`.
5. The backend validates the signature and expiration. If valid, it reads the hidden PDF and streams it to the user.

### H. Known Limitations (No Database)
Because this architecture operates entirely without a database:
- **Download Limits:** We cannot track how many times a user clicked the download button. The security relies entirely on the 60-minute expiration window of the signed token.
- **Webhook Idempotency:** Webhooks may be delivered multiple times by Cashfree. Without a database, we cannot definitively store an `is_processed` flag. The webhook currently acts as a secure logging mechanism.
- **Order History:** We do not maintain a permanent historical record of orders on the website. You must rely on the Cashfree Merchant Dashboard for order history and accounting.
- **Email Delivery:** Sending automated emails is not implemented because without a database, processing a duplicate webhook would result in sending duplicate emails to the customer.

> **Return URL is not payment verification:** The frontend never trusts the Cashfree redirection URL as proof of payment. It always forces the backend to independently verify the status with Cashfree's servers.
