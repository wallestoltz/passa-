// POST /api/checkout – skapar en Stripe Checkout-session där hundägaren betalar med kort.
// Pengarna förs över till hundvaktens Stripe-konto (destination charge). Passa kan ta en avgift
// genom att sätta PLATFORM_FEE_PERCENT.
//
// OBS: I prototypen kommer belopp och mottagare från webbläsaren. När Passa får en databas
// ska servern i stället läsa pris och hundvaktens konto från bokningen i databasen.
const { stripe, safeUrl, send, readJson, ACCOUNT_ID, missingKey } = require("../lib/stripe");

const MIN_KR = 50;
const MAX_KR = 50000;

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "Använd POST." });
  const s = stripe();
  if (!s) return missingKey(res);
  const body = await readJson(req);

  const amount = Math.round(Number(body.amount));
  const destination = String(body.destination || "");
  const bookingId = String(body.bookingId || "");
  const description = String(body.description || "Hundpassning").slice(0, 200);

  if (!Number.isFinite(amount) || amount < MIN_KR || amount > MAX_KR) {
    return send(res, 400, { error: `Beloppet måste vara mellan ${MIN_KR} och ${MAX_KR} kr.` });
  }
  if (!ACCOUNT_ID.test(destination)) return send(res, 400, { error: "Hundvakten har inget giltigt Stripe-konto." });
  if (!/^[A-Za-z0-9]{4,40}$/.test(bookingId)) return send(res, 400, { error: "Ogiltig bokning." });

  try {
    const account = await s.accounts.retrieve(destination);
    if (!account.charges_enabled) {
      return send(res, 409, { error: "Hundvakten har inte slutfört sin Stripe-koppling än." });
    }

    const feePercent = Math.min(Math.max(Number(process.env.PLATFORM_FEE_PERCENT || 0), 0), 50);
    const fee = Math.round((amount * 100 * feePercent) / 100);

    const session = await s.checkout.sessions.create({
      mode: "payment",
      locale: "sv",
      line_items: [
        {
          quantity: 1,
          price_data: { currency: "sek", unit_amount: amount * 100, product_data: { name: description } },
        },
      ],
      payment_intent_data: {
        transfer_data: { destination },
        ...(fee > 0 ? { application_fee_amount: fee } : {}),
        metadata: { bookingId },
      },
      metadata: { bookingId },
      success_url: safeUrl(body.successUrl, req, "/app.html?betalning=klar&session_id={CHECKOUT_SESSION_ID}#bokningar"),
      cancel_url: safeUrl(body.cancelUrl, req, "/app.html#bokningar"),
    });

    send(res, 200, { id: session.id, url: session.url });
  } catch (e) {
    send(res, 500, { error: e.message });
  }
};
