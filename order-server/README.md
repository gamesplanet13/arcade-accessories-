# GAMES PLANET — Private Order Records

Status: implementation ready; server deployment and API URL activation are still required. GitHub Pages alone cannot host this private database/API. No customer record is stored in this public repository.

## Activate

1. Sign in/create your own Cloudflare account at https://dash.cloudflare.com/ .
2. Download this `order-server` directory, install Node.js, then run `node setup.mjs` from it. Cloudflare login opens. Create the D1 database, paste its ID, choose your admin ID/password when prompted. Password is hidden and uploaded only as a salted PBKDF2 hash in Worker secrets.
3. Copy the deployed Worker HTTPS URL. Set `apiUrl` in `orders-config.js` at the arcade-accessories repository root, for example `https://games-planet-orders.YOUR-SUBDOMAIN.workers.dev`. All four checkout pages load that one central config.
4. Check `/health`, then submit a test order. Confirm it appears in `admin-orders.html`. Do not assume records are saving before activation.

## Pages

Admin: https://gamesplanet13.github.io/arcade-accessories-/admin-orders.html
Customer: https://gamesplanet13.github.io/arcade-accessories-/customer-orders.html

Customer registers with a private receipt token generated at order submission. Username/phone alone never grants another buyer's records. Logged-in customers can link further receipts and read their own orders. They cannot edit, approve, or change payment state.

Admin can search any customer/order/product/address word, edit the complete payload, confirm manual payment, approve/revoke invoice access, set Pending/Successful/Dispatched/Cancelled status, dispatch date/by, courier, AWB, and HTTPS tracking link. Changes leave an audit entry. JSON backup export includes all matching records, using pagination.

Customer invoice data is fetched from an authenticated API and denied unless both payment_verified and invoice_approved are true. The approved invoice preserves checkout GST/no-GST amounts. The portal can download PDF or JPEG, print/save PDF in the browser, or download the HTML invoice. Every action first requests the approved invoice from the authenticated API. Admin invoice access is always allowed. Payment is never verified from the customer-supplied amount or message.

## Backups / tests

Run `node test.mjs` (Node.js with built-in node:sqlite). Tests use a local temporary database, not production.

Download filtered JSON from the admin dashboard regularly. For a full database including audit and accounts, run `npx wrangler d1 export games-planet-orders --remote --output=private-orders-backup.sql`. Keep this backup private, never commit it to GitHub.

The server has per-IP submission/login rate limits, 8-hour hashed sessions, customer ownership checks on every lookup and download, and parameterized SQL. Customer statuses are server controlled. Legacy browser-only orders are not silently imported: they predate reliable server verification. Admin can preserve existing WhatsApp history separately.

Prepaid form wired: `gamesplanet13/PreOrder`. Other order repositories need their exact checkout path checked before integration; don't blindly overwrite unrelated pages.

Official deployment reference: https://developers.cloudflare.com/d1/get-started/ and https://developers.cloudflare.com/workers/wrangler/commands/d1/
