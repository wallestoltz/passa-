# Passa

Hemsida och app-prototyp för Passa, hundpassning nära dig.

## Filer

| Fil | Vad den är |
|---|---|
| `index.html` | Hemsidan |
| `app.html` | Appen: sök hundvakt, uppdragskalender, lägg ut uppdrag, bokning, Swish-betalning, meddelanden, annonser och omdömen |
| `img/` | Skärmbilder från appen som visas på hemsidan |

Allt är vanlig HTML, CSS och JavaScript. Det finns inga beroenden och inget byggsteg.

## Funktioner i appen

- **Hitta hundvakt:** filtrera på promenad, hunddagis eller övernattning, ort och avstånd. Sortera på avstånd, pris eller betyg.
- **Uppdragskalender:** bläddra månad för månad ett år framåt och se hur många hundägare som söker hundvakt varje dag. Välj en dag för att se uppdragen och erbjud dig.
- **Lägg ut uppdrag:** hundägare beskriver hunden, tjänsten, datumen och ersättningen. Uppdraget dyker upp i kalendern.
- **Bokning och Swish:** priset räknas ut per timme, dag eller natt. Efter passet visas Swish-nummer, belopp och meddelande att kopiera.
- **Meddelanden, annonser och omdömen.**

## Kör lokalt

Öppna `index.html` i webbläsaren, eller starta en enkel server i mappen:

```bash
python3 -m http.server 8000
```

och gå till http://localhost:8000.

## Publicera med GitHub Pages

1. Gå till **Settings → Pages** i repot.
2. Under **Build and deployment** väljer du **Deploy from a branch**, branch `main` och mappen `/ (root)`.
3. Spara. Efter någon minut finns sidan på `https://<användarnamn>.github.io/<repo-namn>/`.

## Viktigt att veta

- Appen är en prototyp. Data sparas bara i besökarens egen webbläsare (localStorage) och delas inte mellan användare.
- Hundvakter och uppdrag märkta *Exempel* är påhittade.
- Swish-betalningen visar nummer, belopp och meddelande att kopiera. Pengarna går direkt mellan hundägare och hundvakt, och appen hanterar inga pengar.
- Klarna, inloggning, BankID och identitetskontroll finns inte än och kräver en server och avtal.
