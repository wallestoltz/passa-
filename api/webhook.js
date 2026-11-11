// POST /api/webhook – tar emot händelser från Stripe, till exempel när en betalning är klar
// eller när en hundvakt har slutfört sin registrering. Signaturen kontrolleras alltid.
// När Passa får en databas är det här bokningar markeras som betalda på riktigt.
const { stripe, send } = require("../lib/stripe");

function rawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "Använd POST." });
  const s = stripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!s || !secret) return send(res, 503, { error: "Stripe eller STRIPE_WEBHOOK_SECRET saknas." });

  let event;
  try {
    event = s.webhooks.constructEvent(await rawBody(req), req.headers["stripe-signature"], secret);
  } catch (e) {
    return send(res, 400, { error: "Ogiltig signatur." });
  }

  switch (event.type) {
    case "checkout.session.completed":
      console.log("Betalning klar för bokning", event.data.object.metadata && event.data.object.metadata.bookingId);
      break;
    case "account.updated":
      console.log("Stripe-konto uppdaterat", event.data.object.id, "kan ta betalt:", event.data.object.charges_enabled);
      break;
    default:
      break;
  }
  send(res, 200, { received: true });
};
