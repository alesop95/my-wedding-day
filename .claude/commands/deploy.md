# /project:deploy

Prepara e verifica il progetto per il deploy su Firebase Hosting con dominio `weddingonline.it`.

## Protocollo

### 1. Verifica pre-build
```bash
npx tsc --noEmit          # zero errori TypeScript
yarn test --watchAll=false # tutti i test passano
```

### 2. Build
```bash
yarn build
```
Verifica che la cartella `build/` sia generata senza errori.

### 3. Verifica contenuto build
```bash
ls -la build/
cat build/index.html | head -20    # verifica che il root div <div id="root"> esista
ls build/static/js/                # verifica che i bundle JS esistano
```

### 4. Verifica firebase.json

Deve esistere nella root del progetto con questo contenuto:
```json
{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

Il rewrite è critico: senza di esso, qualsiasi accesso diretto a `weddingonline.it/{familyId}` restituirebbe 404.

### 5. Verifica credenziali Firebase

In `App.tsx`, `firebaseConfig` NON deve avere campi vuoti:
```bash
grep -A 8 "firebaseConfig" src/App.tsx
```
Se i campi sono vuoti (`""`), il deploy funzionerà ma l'app non potrà comunicare con Firestore.

### 6. Deploy (da eseguire manualmente)

```bash
# Installare Firebase CLI se non presente
npm install -g firebase-tools

# Login (una volta sola)
firebase login

# Inizializzare hosting (una volta sola, se firebase.json non esiste)
firebase init hosting
# → selezionare il progetto Firebase
# → public directory: build
# → single-page app: Yes
# → overwrite build/index.html: No

# Deploy
firebase deploy --only hosting
```

> ⚠️ Claude NON esegue `firebase deploy` autonomamente. Il deploy è sempre manuale.

### 7. Configurazione dominio personalizzato (una volta sola)

Dopo il primo deploy, l'app è accessibile su `https://<project-id>.web.app`.

Per collegare `weddingonline.it`:
1. Console Firebase → Hosting → "Add custom domain" → `weddingonline.it`
2. Firebase chiede verifica proprietà → aggiungere record TXT su Register.it (Gestione avanzata DNS)
3. Firebase fornisce IP per record A → modificare il record A di `weddingonline.it` su Register.it
4. Aggiungere anche `www.weddingonline.it` come custom domain (opzionale, il CNAME esistente lo copre)
5. Attendere propagazione DNS (1-48h) e generazione certificato SSL

**Regola critica:** NON toccare record MX, PEC, TXT SPF, SRV, autoconfig, pop su Register.it — servono per la posta `info@weddingonline.it`.

**Backup DNS:** Prima di modificare qualsiasi record, esportare il CSV della zona DNS da Register.it (Gestione avanzata → Esporta). Salvare come `dns-backup-YYYYMMDD.csv`.

### 8. Post-deploy checklist
```
### ✅ Deploy checklist
- [ ] tsc --noEmit: zero errori
- [ ] yarn test: tutti i test passano
- [ ] yarn build: completato senza errori
- [ ] firebase.json presente con rewrite SPA
- [ ] Credenziali Firebase configurate (non vuote in App.tsx)
- [ ] firebase deploy --only hosting eseguito
- [ ] App accessibile su https://<project-id>.web.app
- [ ] DNS weddingonline.it configurato (record A verso Firebase)
- [ ] https://weddingonline.it carica l'app
- [ ] https://weddingonline.it/{familyId} carica i dati della famiglia
- [ ] https://weddingonline.it/admin?password=X carica il pannello admin
- [ ] Certificato SSL attivo (lucchetto verde)
- [ ] Email info@weddingonline.it funzionante (MX non toccati)
```
