# Passa

Hemsida och app-prototyp för Passa, barn- och hundpassning nära dig.

## Filer

| Fil | Vad den är |
|---|---|
| `index.html` | Hemsidan |
| `app.html` | Appen (sök, bokning, Swish-betalning, meddelanden, annonser, omdömen) |
| `img/` | Skärmbilder från appen som visas på hemsidan |

Allt är vanlig HTML, CSS och JavaScript. Det finns inga beroenden och inget byggsteg.

## Kör lokalt

Öppna `index.html` i webbläsaren, eller starta en enkel server i mappen:

```bash
python3 -m http.server 8000
```

och gå till http://localhost:8000.

## Publicera med GitHub Pages

1. Lägg upp filerna i ett repo på GitHub.
2. Gå till **Settings → Pages**.
3. Under **Build and deployment** väljer du **Deploy from a branch**, branch `main` och mappen `/ (root)`.
4. Spara. Efter någon minut finns sidan på `https://<ditt-användarnamn>.github.io/<repo-namn>/`.

## Viktigt att veta

- Appen är en prototyp. Data sparas bara i besökarens egen webbläsare (localStorage) och delas inte mellan användare.
- Swish-betalningen visar nummer, belopp och meddelande att kopiera. Pengarna går direkt mellan kund och passare, och appen hanterar inga pengar.
- Klarna, inloggning, BankID och identitetskontroll finns inte än och kräver en server och avtal.
- Passarprofilerna i appen är exempel och är märkta som det.
