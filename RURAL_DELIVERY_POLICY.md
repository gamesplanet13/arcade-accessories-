# Games Planet — Rural / Urban Delivery Policy

Effective: 2026-11-06

This document is the shared checkout rule for all Games Planet product repositories and their order-prefill pages.

1. Show a **Delivery Area: Rural / Urban** selector, with automatic classification available.
2. If **House Number / मकान नंबर** is left blank, treat the address as **Rural**, even if Urban was selected manually. When a house number exists, respect the Rural/Urban selector; auto-detection may also use village words or Branch Office records.
3. **Rural dispatched orders must be fully prepaid. COD is not available.**
4. **Rural delivery methods only:** Post Office (₹100) or Speed Post (₹200). Do not display Delhivery, Trackon, DTDC, BlueDart, Ecom Express, or bus dispatch as rural delivery options.
5. The **₹100 / ₹200** postage is added to the customer-facing payable total and the WhatsApp order details. Never substitute an unrelated live courier quote for these fixed postal rates.
6. **Urban COD:** only Delhivery, subject to the existing ₹1,300 minimum product value and applicable advance, courier charges, and eligibility conditions.
7. In-store pickup is not a dispatched delivery and remains a separate option when the checkout supports it.
8. Validate eligibility at submission, not only by hiding the wrong controls. Include Delivery Area and chosen shipping service in order records.

Canonical shared checkout implementation:
https://gamesplanet13.github.io/arcade-accessories-/order-prefill.html

The product site at Gamesplanet_in, and other repositories with redirect-only order-prefill.html files, use the canonical shared checkout. Standalone manual-order forms (Ordernow, PreOrder, Morder, Cod) must enforce equivalent restrictions.
