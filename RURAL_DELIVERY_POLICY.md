# Games Planet — Rural / Urban Delivery Policy

Effective: 2026-11-06

This document is the shared checkout rule for all Games Planet product repositories and their order-prefill pages.

1. Show a **Delivery Area: Rural / Urban** selector, with automatic classification available.
2. If **House Number / मकान नंबर** is left blank, treat the address as **Rural**, even if Urban was selected manually. When a house number exists, respect the Rural/Urban selector; auto-detection may also use village words or Branch Office records.
3. **Rural dispatched orders must be fully prepaid. COD is not available.**
4. **Rural delivery methods only:**
- Rural postage follows the packed-weight table below.
5. The **₹100 / ₹200** postage is added to the customer-facing payable total and the WhatsApp order details. Never substitute an unrelated live courier quote for these fixed postal rates.
6. **Urban COD:** only Delhivery, subject to the existing ₹1,300 minimum product value and applicable advance, courier charges, and eligibility conditions.
7. In-store pickup is not a dispatched delivery and remains a separate option when the checkout supports it.
8. Validate eligibility at submission, not only by hiding the wrong controls. Include Delivery Area and chosen shipping service in order records.

Canonical shared checkout implementation:
https://gamesplanet13.github.io/arcade-accessories-/order-prefill.html

The product site at Gamesplanet_in, and other repositories with redirect-only order-prefill.html files, use the canonical shared checkout. Standalone manual-order forms (Ordernow, PreOrder, Morder, Cod) must enforce equivalent restrictions.

## Weight-based postal charges (packed parcel weight)

| Packed parcel | Post Office | Speed Post |
|---|---:|---:|
| 0–499 grams | ₹100 | ₹200 |
| 500 grams–1 kilogram | ₹150 | ₹300 |
| Above 1 kilogram | Confirm rate manually | Confirm rate manually |

These are **Games Planet customer-facing shipping charges**, not a claim about official India Post tariffs. Speed Post is double the corresponding Post Office charge. Use actual packed weight including packaging. Do not create a final price or accept payment for an over-1kg Rural shipment until the applicable shipping rate is confirmed.


## India-wide PIN code and office verification

A six-digit PIN code is **not exclusively Rural or Urban**: one PIN can include a Head/Sub Office and multiple Branch Offices. Do not maintain an invented list of exclusively Rural PIN codes.

When determining delivery eligibility:
- Keep the rule **missing house number → Rural**.
- If the customer selects a confirmed Branch Office (BO), treat it as Rural, even if manually marked Urban.
- If a PIN serves more than one post office, require the customer to select the exact office, village or locality.
- When office data is missing or ambiguous, retain the customer Rural/Urban choice subject to the missing-house rule, and verify serviceability before booking.
- The local GitHub PIN dataset is an offline aid, **not proof of live postal serviceability**.

Official verification: https://www.indiapost.gov.in/locate-postoffice

Official Department of Posts directory and office-type data: https://www.data.gov.in/catalog/all-india-pincode-directory-through-webservice

Source explaining mixed rural/urban PINs: https://sansad.in/getFile/loksabhaquestions/annex/10/AU3504.pdf?source=pqals

Example: PIN 244901 (Rampur) is shared by Rampur H.O. and multiple Branch Offices, so it cannot be categorised by PIN alone.
