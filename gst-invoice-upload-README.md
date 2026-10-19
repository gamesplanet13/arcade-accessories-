# GAMES PLANET — Order Upload GST Invoice Page

Open `gst-invoice-upload.html` on the existing GitHub Pages site.

## Workflow

1. Upload multiple JSON / TXT / CSV order files, paste one or more WhatsApp orders, or try text PDFs / screenshots.
2. Imported orders become saved browser drafts. Review customer, product amounts, place of supply and GST-inclusive versus GST-extra pricing.
3. Enter correct HSN/SAC values. The page does not invent codes. Existing invoice manager's 18% default and seller GST details are prefilled and editable.
4. Save/load invoices from the left list. Select several records, use bulk HSN/GST only when appropriate to every selected item, then Review selected batch.
5. Choose A4 with one or two invoices per page. Generate preview, download a combined PDF or Print A4. Long invoices continue in additional slots with totals only on the final part.
6. Export and restore JSON backups to move records between devices.

Storage: IndexedDB in the current browser. Customer files and invoice records are not uploaded to the public GitHub repository or a server. Clearing site/browser storage can remove saved records; keep backups. Invoice sequence reservations are atomic in one browser and unique by financial-year series locally. Multiple devices need coordinated series or manual numbering to prevent duplicate numbers across devices.

Imports: JSON supports `items` / `lines`, arrays, and `{orders:[]}`. CSV supports one product per row, grouped by order_id. WhatsApp text supports the Games Planet field format and complete numbered product / add-on breakdowns. Amount Paid / COD Advance is never used as a product price. Duplicate order IDs are skipped instead of silently creating a second invoice.

OCR: optional Tesseract.js in the browser with English/Hindi models; PDF text extraction uses PDF.js, with OCR fallback for scanned pages. These download libraries/models from jsDelivr and require internet. OCR and complex document layouts may need corrections; extracted invoices are never issued without review. PDF imports are limited to 20 pages and 20 MB per file.

GST: standard forward-charge invoice layout, per-line editable GST and HSN, proportional product discounts, freight with its own HSN/rate, intra-state CGST/SGST or inter-state IGST, amount in words and paid/balance figures. Buyer billing state may differ from place of supply in special cases; the operator must select the correct place of supply. Reverse-charge generation is deliberately blocked because it needs different tax treatment. This creates invoice documents; it does not submit to the government e-invoice portal, generate an IRN or verify GST registrations.

Source reference: CBIC CGST Rules Rule 46
https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/rules/cgst_rules/active/chapter6/rule46_v1.00.html

Checks: `node gst-invoice-core.test.cjs` tests real imports, line totals, advances, grouping, state selection and GST extra/inclusive calculations. `node --check gst-invoice-upload.js` checks browser code syntax. Browser/PDF checks are reported separately according to actual verification.

## Direct WhatsApp billing
Paste the complete customer order into the visible message box and choose **Create invoice + 18% GST**. This path adds 18% GST to product rates (and freight); amount paid remains a separate credit. Multiple messages may be pasted together. File uploads retain their editable import settings.

To refresh an existing unissued draft, paste a single revised message with the same Order ID and choose **Update matching draft from message**. It preserves the invoice number/date, requires confirmation, replaces imported customer/product/payment fields, and requires review again. Issued invoices cannot be replaced through this shortcut. HSN/SAC must be checked again.

This local billing page does not publish invoices to the customer portal. The existing customer portal separately offers downloads after payment verification and invoice approval.

Order-message parsing recognises buyer business name, buyer GSTIN, GST billing address, six-line product/add-on breakdowns, courier charges, final order total and prepaid/COD payments. The stated total is compared with calculated GST totals. Differences are visible; the optional round-off field (-₹1 to +₹1) must be entered explicitly and is printed separately, without changing GST.
