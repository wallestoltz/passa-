# Passa

Hemsida, app och serverfunktioner för Passa, hundpassning nära dig. Betalningar sköts med **Stripe Connect**.

## Filer

| Fil | Vad den är |
|---|---|
| `index.html` | Hemsidan |
| `app.html` | Appen: sök hundvakt, uppdragskalender, lägg ut uppdrag, bokning, kortbetalning, meddelanden, annonser och omdömen |
| `img/` | Skärmbilder från appen som visas på hemsidan |
| `api/` | Serverfunktioner för Stripe Connect (körs på Vercel) |
| `lib/stripe.js` | Gemensam kod för serverfunktionerna |
| `package.json` | Talar om att servern behöver paketet `stripe` |
| `.env.example` | Lista över inställningarna servern behöver |

## Så fungerar betalningen

1. **Hundvakten kopplar Stripe.** På sin annons trycker hundvakten på *Koppla Stripe*. Servern skapar ett Stripe Express-konto och skickar hundvakten till Stripe, där hen fyller i sina uppgifter och sitt bankkonto.
2. **Hundägaren betalar med kort.** Under *Bokningar* trycker hundägaren på *Betala med kort* och kommer till Stripe Checkout. Kortuppgifterna skrivs bara in hos Stripe.
3. **Pengarna går till hundvakten.** Betalningen förs över till hundvaktens Stripe-konto och betalas ut till hens bankkonto. Passa kan ta en avgift genom inställningen `PLATFORM_FEE_PERCENT`.

| Serverfunktion | Vad den gör |
|---|---|
| `GET /api/health` | Talar om för appen att servern finns och om Stripe är inställt |
| `POST /api/connect-onboard` | Skapar hundvaktens Stripe-konto och ger en länk till Stripes registrering |
| `GET /api/connect-status` | Visar om hundvaktens konto kan ta emot betalningar |
| `POST /api/checkout` | Skapar en Stripe Checkout-betalning till hundvaktens konto |
| `GET /api/checkout-status` | Kontrollerar att betalningen gick igenom |
| `POST /api/webhook` | Tar emot händelser från Stripe (valfri) |

## Kom igång

GitHub Pages kan bara visa vanliga filer och kan inte köra serverfunktionerna. Där fungerar hemsidan och appen, men kortbetalningen visas som avstängd. För betalningar behöver sidan köras på **Vercel**, som är gratis för små projekt och hämtar koden direkt från GitHub.

### 1. Skapa ett Stripe-konto
1. Registrera dig på stripe.com och logga in i Stripe Dashboard.
2. Se till att du är i **testläge** (reglaget *Test mode*).
3. Gå till **Connect** och slå på Connect för ditt konto. Välj att du bygger en marknadsplats.
4. Gå till **Utvecklare → API-nycklar** och kopiera den hemliga nyckeln som börjar med `sk_test_`.

Dela aldrig den hemliga nyckeln och lägg den aldrig i koden eller på GitHub.

### 2. Publicera på Vercel
1. Logga in på vercel.com med ditt GitHub-konto.
2. Välj **Add New → Project** och importera repot.
3. Under **Environment Variables** lägger du in:
   - `STRIPE_SECRET_KEY` = din `sk_test_...`-nyckel
   - `PUBLIC_URL` = adressen Vercel ger sidan, till exempel `https://passa.vercel.app` (du kan lägga till den efter första publiceringen och sedan publicera om)
   - `PLATFORM_FEE_PERCENT` = Passas avgift i procent, eller `0`
4. Klicka på **Deploy**.

### 3. Testa hela flödet
1. Öppna `app.html` på din Vercel-adress.
2. Gå till **Profil → Bli hundvakt**, skapa en annons och tryck på **Koppla Stripe**. I testläge kan du fylla i de testuppgifter som Stripe visar på sidan.
3. Boka din egen annons och tryck på **Betala med kort** under Bokningar.
4. Betala med testkortet `4242 4242 4242 4242`, ett valfritt datum framåt i tiden och valfri CVC.
5. Du kommer tillbaka till appen och bokningen visas som *Betald via Stripe*. Betalningen syns i Stripe Dashboard.

### 4. Webhook (valfri)
Gå till **Utvecklare → Webhooks** i Stripe, lägg till `https://din-adress/api/webhook` och välj händelserna `checkout.session.completed` och `account.updated`. Lägg in signeringsnyckeln (`whsec_...`) som `STRIPE_WEBHOOK_SECRET` i Vercel.

### Köra lokalt
```bash
npm install
npx vercel dev
```
Lägg dina inställningar i en fil som heter `.env.local` (se `.env.example`).

## Innan riktig lansering

- **Databas behövs.** Annonser, uppdrag och bokningar sparas i dag bara i varje besökares webbläsare. Det betyder att en hundägare bara kan betala en hundvakt vars annons finns i samma webbläsare. Med en databas (till exempel Supabase) ser alla samma annonser, och servern kan läsa pris och mottagare från bokningen i stället för från webbläsaren.
- **Inloggning** behövs så att bara rätt hundvakt kan koppla och se sitt Stripe-konto.
- **Gå över till skarpt läge** i Stripe först när ovanstående är på plats, och byt då till nyckeln som börjar med `sk_live_`.
- Kontrollera Stripes villkor och avgifter för marknadsplatser, samt vilka skatte- och redovisningsregler som gäller för er och för hundvakterna.

## Viktigt att veta

- Hundvakter och uppdrag märkta *Exempel* är påhittade och går inte att betala.
- Inloggning, BankID och identitetskontroll finns inte än.
