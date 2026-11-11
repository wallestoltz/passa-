// GET /api/health – talar om för appen att servern finns och om Stripe är inställt.
const { send } = require("../lib/stripe");

module.exports = (req, res) => {
  const key = process.env.STRIPE_SECRET_KEY || "";
  send(res, 200, {
    ok: true,
    stripe: Boolean(key),
    mode: key.startsWith("sk_live") ? "live" : key ? "test" : "",
    feePercent: Number(process.env.PLATFORM_FEE_PERCENT || 0),
  });
};
