// POST /api/connect-onboard – skapar ett Stripe Express-konto åt hundvakten (första gången)
// och returnerar en länk till Stripes registrering där hundvakten fyller i uppgifter och bankkonto.
const { stripe, safeUrl, send, readJson, ACCOUNT_ID, missingKey } = require("../lib/stripe");

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "Använd POST." });
  const s = stripe();
  if (!s) return missingKey(res);
  const body = await readJson(req);

  try {
    let accountId = body.accountId || null;
    if (accountId && !ACCOUNT_ID.test(accountId)) return send(res, 400, { error: "Ogiltigt Stripe-konto." });

    if (!accountId) {
      const account = await s.accounts.create({
        type: "express",
        country: "SE",
        capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
        business_profile: { product_description: "Hundpassning via Passa" },
      });
      accountId = account.id;
    }

    const link = await s.accountLinks.create({
      account: accountId,
      type: "account_onboarding",
      return_url: safeUrl(body.returnUrl, req, "/app.html#profil"),
      refresh_url: safeUrl(body.refreshUrl, req, "/app.html#profil"),
    });

    send(res, 200, { accountId, url: link.url });
  } catch (e) {
    send(res, 500, { error: e.message });
  }
};
