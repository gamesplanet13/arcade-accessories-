GAMES PLANET DELHIVERY LIVE RATE SETUP

1. Refresh/revoke every token previously posted in chat.
2. Create a Cloudflare account and install Wrangler: npm install -g wrangler
3. In this folder run: wrangler login
4. Save the NEW token securely: wrangler secret put DELHIVERY_API_TOKEN
5. Deploy: wrangler deploy
6. Copy the returned workers.dev URL into ../delhivery-config.js
7. Upload the updated website files to GitHub Pages.

Never put the API token in HTML, JavaScript, GitHub, or delhivery-config.js.
The website automatically falls back to configured courier slabs if the live API is unavailable.
