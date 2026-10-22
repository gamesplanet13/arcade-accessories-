# Unified order records and label queue

Owner dashboard: https://games-planet-orders-central.gamesplanet.chatgpt.site

Label maker: https://games-planet-orders-central.gamesplanet.chatgpt.site/labels

All public storefront records are submitted through https://games-planet-order-intake.gamesplanet.chatgpt.site. Orders are private server-side D1 records, not public GitHub files. Backend source is mirrored here for review; runtime secrets stay in Sites settings.

Submission writes a durable local outbox before the network request. Failed submissions remain visible as pending sync and retry on online events / page reopening. Normal submission attempts server save before opening WhatsApp. Stable submission/receipt keys and a unique Order ID prevent duplicate records. A customer receipt can update only a still-pending record; reviewed orders require an owner edit.

Owner access uses the existing ChatGPT account for this Site. Accept — payment verified marks an order successful. Only successful, payment-verified prepaid orders enter the label queue; COD, pending and rejected orders are excluded. Owner modifications advance a revision and replace the existing queued label.

Print does not prove a physical printer succeeded. After opening the print window, choose Printed successfully to remove that exact revision from the queue. Closing / cancelling without confirmation retains labels. PDF download does not mark printed. Printed records stay archived in the dashboard. A stale batch cannot mark a modified/rejected order printed. Editing a previously printed order creates a new revision for reprint.

Offline PIN data is cached after the first successful online visit. Destination/state/city/post-office, distance, prepaid/COD ETA and estimated dates use the shared data. ETA excludes Sundays and the day the order is shared. Offline devices cannot upload until a connection returns.

Legacy manual label tool remains at https://gamesplanet13.github.io/lablemaker/?manual=1 .
