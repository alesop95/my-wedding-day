# /project:test-flow

Esegui il flusso di test completo dell'applicazione. Questo copre due scenari: senza Firebase (UI only) e con Firebase (integrazione completa).

## Fase I — Test senza Firebase (UI + animazioni + navigazione)

L'applicazione funziona in modalità development con dati dummy quando le credenziali Firebase sono vuote. Questo permette di testare UX, animazioni e struttura senza dipendere dal backend.

### Setup
```bash
yarn install
yarn start
# L'app si avvia su http://localhost:3000
```

### Test 1: Caricamento homepage (development mode)
- URL: `http://localhost:3000`
- Aspettative:
  - Header animato con personaggi SVG (mario.svg, giulia.svg)
  - WeddingRings con animazione spring/bounce
  - Sezioni principali visibili dopo animazione boot
  - Dati dummy caricati senza errori Firebase
- Controlli:
  - Animazioni Framer Motion funzionanti
  - Layout responsive su diverse dimensioni finestra
  - Console browser: zero errori bloccanti (warning Firebase attesi)

### Test 2: Pannello admin
- URL: `http://localhost:3000/admin?password=<admin password>`
- Aspettative:
  - Rendering componente `<Admin />`
  - Lista famiglie (dummy o Firestore)
  - Report con conteggi
- Nota: senza Firebase configurato, la verifica password fallirà. Il test verifica solo che il routing condizionale funzioni.

### Test 3: Pannello ristorante
- URL: `http://localhost:3000/restaurant?password=<restaurant password>`
- Aspettative:
  - Rendering componente `<Restaurant />`
  - Gestione tavoli
- Stessa nota del Test 2.

### Test 4: Easter egg
- Azione: cliccare 5 volte sul personaggio sinistro (mario.svg) nell'header
- Aspettative:
  - Attivazione `easterEggAtom`
  - Overlay scuro con animazioni Lottie (thunderbolt)
  - Audio back_to_the_future.mp3
  - Animazione personaggio (caduta + rotazione + uscita)
  - Fire animation dopo ~4.7s
  - Ritorno alla posizione originale

### Test unitari
```bash
yarn test --watchAll=false
# Tutti i test in src/ devono passare
```

---

## Fase II — Test con Firebase (integrazione completa)

### Prerequisiti
1. Progetto Firebase creato nella console (console.firebase.google.com)
2. Firestore attivato in modalità test o con regole configurate
3. Authentication anonima abilitata
4. Credenziali inserite in `firebaseConfig` dentro `App.tsx`:
   ```typescript
   const firebaseConfig = {
     apiKey: "...",          // NON vuoto
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

### Test 5: Accesso ospite con familyId
- Prerequisito: creare un documento in Firestore collection `wedding` con id es. `TESTFAMILY`
- URL: `http://localhost:3000/TESTFAMILY`
- Aspettative:
  - Auth anonima completata (nessun errore in console)
  - `useFamilyData` carica il documento corrispondente
  - Sezioni renderizzate con dati reali della famiglia
  - RSVPSection mostra i membri della famiglia

### Test 6: Conferma RSVP
- Azione: aprire l'URL della famiglia di test, cambiare rsvp di un membro da "unknown" a "yes"
- Aspettative:
  - ConfettiExplosion attivato
  - `updateDoc` eseguito su Firestore
  - Il documento in Firestore riflette il cambio
  - Ricaricando la pagina, il dato è persistito

### Test 7: Admin con dati reali
- URL: `http://localhost:3000/admin?password=<password reale da collection admin>`
- Aspettative:
  - `useAdminData` carica tutte le famiglie da Firestore
  - Report mostra conteggi reali
  - Le azioni (switch onlyInfo, checkbox linkSent, etc.) persistono su Firestore

### Test 8: Build di produzione
```bash
yarn build
# Verificare:
# - Zero errori
# - Cartella build/ generata
# - build/index.html contiene <div id="root">
# - build/static/js/ contiene i bundle
```

---

## Checklist finale
```
### ✅ Test flow completato
Fase I (senza Firebase):
- [ ] Homepage carica con dati dummy
- [ ] Animazioni header funzionanti
- [ ] Easter egg funzionante
- [ ] yarn test passa

Fase II (con Firebase):
- [ ] Credenziali Firebase configurate (non vuote)
- [ ] Auth anonima funzionante
- [ ] Accesso ospite con familyId funzionante
- [ ] RSVP persiste su Firestore
- [ ] Admin carica dati reali
- [ ] yarn build completato senza errori
```
