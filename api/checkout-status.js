// GET /api/checkout-status?session_id=cs_... – kontrollerar att betalningen faktiskt gick igenom hos Stripe.
const { stripe, send, query, missingKey } = require("../lib/stripe");

module.exports = async (req, res) => {
  const s = stripe();
  if (!s) return missingKey(res);
  const id = query(req).get("session_id") || "";
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return send(res, 400, { error: "Ogiltig betalning." });

  try {
    const session = await s.checkout.sessions.retrieve(id, { expand: ["payment_intent.latest_charge"] });
    const charge = session.payment_intent && session.payment_intent.latest_charge;
    send(res, 200, {
      paid: session.payment_status === "paid",
      bookingId: (session.metadata && session.metadata.bookingId) || "",
      amount: (session.amount_total || 0) / 100,
      receiptUrl: (charge && charge.receipt_url) || "",
    });
  } catch (e) {
    send(res, 500, { error: e.message });
  }
};
