// Gemensamma hjälpfunktioner för serverfunktionerna i api/.
const Stripe = require("stripe");

let client = null;
function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!client) client = new Stripe(key);
  return client;
}

// Adressen som Stripe får skicka tillbaka användaren till.
function allowedOrigin(req) {
  if (process.env.PUBLIC_URL) return new URL(process.env.PUBLIC_URL).origin;
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${req.headers.host}`;
}

// Tillåt bara återvändande till den egna sidan, aldrig till en annan webbplats.
function safeUrl(url, req, fallbackPath) {
  const origin = allowedOrigin(req);
  try {
    const parsed = new URL(String(url).replace("{CHECKOUT_SESSION_ID}", "SESSION"));
    if (parsed.origin === origin) return String(url);
  } catch (e) {}
  return origin + fallbackPath;
}

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => { data += c; if (data.length > 1e5) req.destroy(); });
    req.on("end", () => { try { resolve(JSON.parse(data || "{}")); } catch (e) { resolve({}); } });
  });
}

function query(req) {
  return new URL(req.url, "http://localhost").searchParams;
}

const ACCOUNT_ID = /^acct_[A-Za-z0-9]+$/;
const missingKey = (res) => send(res, 503, { error: "STRIPE_SECRET_KEY saknas på servern." });

module.exports = { stripe, allowedOrigin, safeUrl, send, readJson, query, ACCOUNT_ID, missingKey };
