// GET /api/connect-status?account=acct_... – visar om hundvaktens Stripe-konto kan ta emot betalningar.
const { stripe, send, query, ACCOUNT_ID, missingKey } = require("../lib/stripe");

module.exports = async (req, res) => {
  const s = stripe();
  if (!s) return missingKey(res);
  const account = query(req).get("account") || "";
  if (!ACCOUNT_ID.test(account)) return send(res, 400, { error: "Ogiltigt Stripe-konto." });

  try {
    const a = await s.accounts.retrieve(account);
    send(res, 200, {
      chargesEnabled: Boolean(a.charges_enabled),
      payoutsEnabled: Boolean(a.payouts_enabled),
      detailsSubmitted: Boolean(a.details_submitted),
    });
  } catch (e) {
    send(res, 500, { error: e.message });
  }
};
