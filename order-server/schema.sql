PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, salt TEXT NOT NULL, password_hash TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY, account_id TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','customer')), expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY, submission_key TEXT NOT NULL UNIQUE, claim_hash TEXT NOT NULL, account_id TEXT REFERENCES accounts(id), source TEXT NOT NULL, order_id TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, payload TEXT NOT NULL, search_text TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', payment_verified INTEGER NOT NULL DEFAULT 0, invoice_approved INTEGER NOT NULL DEFAULT 0, dispatch_by TEXT NOT NULL DEFAULT '', dispatch_date TEXT NOT NULL DEFAULT '', courier TEXT NOT NULL DEFAULT '', tracking_number TEXT NOT NULL DEFAULT '', tracking_url TEXT NOT NULL DEFAULT '');
CREATE INDEX IF NOT EXISTS orders_account ON orders(account_id,created_at);
CREATE INDEX IF NOT EXISTS orders_created ON orders(created_at);
CREATE TABLE IF NOT EXISTS audit(id TEXT PRIMARY KEY, order_ref TEXT NOT NULL, actor TEXT NOT NULL, changed_at TEXT NOT NULL, before_json TEXT NOT NULL, after_json TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS rate_limits(key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
