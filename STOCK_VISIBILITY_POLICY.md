# GAMES PLANET — Public Product Visibility and Variant Policy

Effective: 2026-11-06.

The central inventory at `arcade-accessories-/data/master-products.json` is authoritative for availability.

1. Hide the **entire customer-facing product card**, search result, listing, related item, direct product purchase page, and cart/checkout selection when its stock is 0, `available=false`, `hiddenFromStore=true`, or `active=false`. Do **not** show an "Out of Stock" card or unavailable badge.
2. For a product with variants, omit every variant whose stock is 0 or which is explicitly unavailable. If all variants are unavailable, hide the entire product.
3. Preserve hidden product entries, images, names, variants, historic IDs, stock logs and original source records in GitHub. Never delete an item merely because it cannot be sold today.
4. If a product is restored, update its stock and clear its hidden/unavailable flags; it can then return to the storefront. Confirm live stock before shipping.
5. Validate availability at cart and checkout as well as in the visible catalog. Old saved carts, direct product links and other storefronts must not bypass the rule.

## Imported Arcade Push Button (2026-11-06)

- Main visible product: **BAO LIAN Imported Arcade Push Button** — **₹46**.
- **Pink (H54)** is an available variant of the main product, priced at **₹46**.
- **Green (H60)** is unavailable: **do not display it as a product or a variant**.
- The old standalone **Imported Arcade Push Button H60 / H54** is archived (`hiddenFromStore=true`, stock 0). It remains in the central database but must not be listed.
- The regular BAO LIAN Green color and Green (H60) are separate named entries; do not automatically treat them as the same variant.
- Known existing exclusions such as Push Button Yellow and MD Handle Black remain hidden while their available color variants continue to sell.

## Affected storefronts

`arcade-accessories-`, `Gamesplanet_in`, `ArcadeAccessories-`, `Products`, and relevant arcade-box card listings should respect stock state. Other repositories handing orders to the shared checkout must not reintroduce archived products.

The public shop must show only orderable items. Stock records are kept privately in the repository for future reactivation.
