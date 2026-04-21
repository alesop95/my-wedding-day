# CLAUDE.md — Memory Layer

> Questo file è la fonte primaria di contesto per Claude Code. Viene letto automaticamente all'apertura del progetto.
> Per i dettagli di ogni layer, fare riferimento ai file nella cartella `.claude/`.

---

## Identità del progetto

**Nome:** my-wedding-day
**Tipo:** SPA React 18 + TypeScript, serverless
**Scopo:** Wedding planner interattivo per il matrimonio di Alessio & Beatrice, 24 Luglio 2027
**Deploy target:** Firebase Hosting (CDN statico, zero backend Node)

---

## Stack tecnologico (vincolante)

| Tecnologia | Versione | Ruolo | NON usare in alternativa |
|---|---|---|---|
| React | 18.2.0 | Framework UI (CRA/Webpack) | NO Next.js, NO SSR, NO Vite |
| TypeScript | 5.0.2 | Tipizzazione statica | — |
| Material-UI | 5.11.13 | Componenti UI + theme-styling (`src/theme.ts`) | NO shadcn, NO Chakra, NO Tailwind |
| Jotai | 2.0.3 | State management atom-based | NO Redux, NO Zustand, NO Context API per stato globale |
| Firebase | 9.18.0 | Firestore + Auth anonima | NO Supabase, NO backend Node |
| Framer Motion | 10.12.10 | Animazioni e transizioni UI | NO react-spring, NO GSAP |
| fp-ts | 2.13.1 | Option, Either, TaskEither | — |
| Lottie React | 2.4.0 | Animazioni JSON | — |
| immer | — | Immutable state updates | — |
| react-confetti-explosion | — | Animazione particellare | — |
| react-responsive-carousel | — | Carousel immagini | — |

---

## Architettura

### Pattern strutturale

```
src/
├── admin/          → Pannello amministrativo (accesso via ?password=)
├── animation/      → File Lottie JSON
├── common/         → Componenti riutilizzabili (Divider, ErrorMask, LoadingMask, SectionHeader, WhatsAppWidget)
├── container/      → Container principale con easter egg
├── header/         → Header animato con personaggi SVG
├── hooks/          → Custom hooks React (data fetching Firebase, logica temporale)
├── images/         → Asset importati nel bundle via import
├── restaurant/     → Gestione tavoli ristorante (accesso via ?password=)
├── sections/       → Sezioni principali app (ogni sezione = componente autosufficiente)
├── state/          → Atomi Jotai (bootAnimationAtom, easterEggAtom)
├── types/          → Definizioni TypeScript (family.ts)
├── utils/          → Funzioni utility (constants.ts, date.ts, env.ts, family.ts)
├── App.tsx         → Orchestratore: routing condizionale + composizione sezioni
├── index.tsx       → Bootstrap React + ThemeProvider
└── theme.ts        → Tema Material-UI
```

### Regola di composizione

Ogni feature = **sezione** in `src/sections/` + **hook** in `src/hooks/` + **tipo** in `src/types/`

- Dati remoti → hook Firebase custom
- Stato locale/cache → atomi Jotai
- UI → componenti MUI, colori/spacing/typography **esclusivamente** dal theme (`src/theme.ts`)
- **Testi e traduzioni** → `react-i18next` obbligatorio per tutti i testi UI. **Zero testi hardcoded** in componenti
- Errori → fp-ts: `Option<T>` per nullable, `Either<Error, T>` per fallibili, `TaskEither` per async
- Animazioni → Framer Motion per transizioni, Lottie per animazioni vettoriali
- Asset statici (URL) → `public/`. Asset importati → `src/images/` o `src/animation/`

### Routing

**NON si usa React Router.** Il routing è condizionale implicito in `App.tsx`:
- `/admin?password=X` → verifica password su Firestore collection `admin` → renderizza `<Admin />`
- `/restaurant?password=X` → idem → renderizza `<Restaurant />`
- `/{familyId}` → ogni famiglia accede tramite URL come credenziale (ID nel path)
- `useFamilyData` estrae `familyId` dal pathname e carica da Firestore collection `wedding`

### Internazionalizzazione (i18n)

**Sistema:** React-i18next con supporto IT/EN + persistenza localStorage via Jotai  
**Struttura traduzioni:**
```
src/i18n/
├── index.ts           → Configurazione i18next
└── locales/
    ├── it.json        → Traduzioni italiane (default)
    └── en.json        → Traduzioni inglesi
```

**Pattern utilizzo obbligatorio:**
- Ogni componente usa `const { t } = useTranslation()`
- Zero testi hardcoded: sostituire con `t("sections.componentName.textKey")`
- Utility functions: versioni i18n (`getWhatsAppMessageI18n`) che accettano funzione `t` come parametro
- **LanguageSwitcher:** sempre visibile nell'header (top-right, MUI ToggleButtonGroup)

**Regola critica:** Ogni nuovo componente/feature deve usare i18n dal primo commit.

### Rendering condizionale di App.tsx

```
Se admin → <Admin />
Se restaurant → <Restaurant />
Se !result || !elapsed → <LoadingMask />
Se isWeddingOver → <WeddingIsOver />
Se result.kind === "error" → <ErrorMask />

Altrimenti:
  <Container>
    <Header onAnimationComplete />           ← Include LanguageSwitcher
    {headerAnimationEnd && (
      <WeAreWedding />                      ← 100% i18n
      {isPartyStarted && <GallerySection />} ← 100% i18n
      {!isPartyStarted && <AtHome />}       ← 100% i18n
      <WhereSection onlyInfo={result.data.onlyInfo} /> ← 100% i18n
      {!onlyInfo && !isWeddingStarted && (
        <RSVPSection familyData={result.data} />      ← 100% i18n
        <HotelSection />                              ← 100% i18n
      )}
      <GiftSection />                       ← 100% i18n
      {!isWeddingOver && <GuestbookSection />}       ← 100% i18n
      {!isPartyStarted && <GallerySection />}        ← 100% i18n
    )}
  </Container>
```

### Stato temporale (`useWedding.ts`)

| Flag | Condizione | Significato |
|---|---|---|
| `isWeddingStarted` | `now > 24/07/2027 00:00` | Il matrimonio è iniziato |
| `isPartyStarted` | `now > 24/07/2027 19:30` | La festa è iniziata |
| `isWeddingOver` | `now >= 25/07/2027 00:00` | Tutto finito → schermata statica |

Aggiornamento: ogni 15 minuti via `setInterval`.

---

## Modello dati

### FamilyMember

```typescript
export type FamilyMember = {
  firstName: string;
  lastName: string;
  recipient: boolean;
  isChild: boolean;
  infant?: boolean;
  sex: "male" | "female";
  rsvp: "yes" | "no" | "maybe" | "unknown";
  table?: { tableId: string; note?: string | null } | null;
  // Feature 3 - Dashboard extensions
  allergies?: string[];       // es. ["glutine", "lattosio"]
  dietaryNotes?: string;      // note libere (vegetariano, vegano, etc.)
  drinkPreference?: string;   // es. "Spritz", "Gin Tonic" (per tracciamento cocktail)
};
```

### FamilyData

```typescript
export type FamilyData = {
  family: string;
  side?: "Alessio" | "Beatrice";
  gift?: number;
  donation?: number;
  reminderSent?: boolean;
  note: string;
  id: string;
  linkSent: boolean;
  members: FamilyMember[];
  onlyInfo: boolean;
};
```

### Collections Firestore

| Collection | Scopo | Accesso |
|---|---|---|
| `wedding` | Dati famiglie + membri + RSVP | Lettura: per familyId. Scrittura: utente autenticato |
| `admin` | Password admin | Lettura: solo client admin |
| `tables` | Configurazione tavoli ristorante | Lettura/Scrittura: admin ristorante |
| `guestbook` | Messaggi ospiti con real-time sync | Lettura: pubblico. Scrittura: utenti autenticati. Moderazione: admin |

### GuestbookEntry

```typescript
export type GuestbookEntry = {
  id: string;
  familyId: string;
  authorName: string;
  message: string;
  createdAt: Date;
};
```

---

## Feature implementate

### ✅ Feature 1 — Guestbook (COMPLETATA)

**Status:** Implementata e testata ✅  
**Data completamento:** 2026-04-20  
**File implementati:**
- `src/types/guestbook.ts` — Definizione tipo `GuestbookEntry`
- `src/hooks/useGuestbook.ts` — Hook Firebase per messaggi real-time
- `src/sections/GuestbookSection.tsx` — UI componente guestbook
- Collection Firestore: `guestbook`

**Funzionalità:**
- ✅ Real-time messaging con onSnapshot
- ✅ Autenticazione anonima Firebase
- ✅ Validazione form (nome obbligatorio, messaggio max 500 char)
- ✅ Gestione errori con fp-ts TaskEither pattern
- ✅ Moderazione admin (eliminazione messaggi)
- ✅ Fix serverTimestamp() null handling
- ✅ Test completo su familia reale (`test-family-123`)

**Bug risolti:**
- 🔧 Race condition auth anonima vs query Firestore
- 🔧 Error `Cannot read properties of null (reading 'toDate')` da serverTimestamp()

### ✅ Feature 2 — Internazionalizzazione (i18n) Multi-Lingua (COMPLETATA)

**Status:** Implementata e testata ✅  
**Data completamento:** 2026-04-20  
**File implementati:**
- `src/i18n/index.ts` — Configurazione i18next + react-i18next
- `src/i18n/locales/it.json` — Traduzioni italiane complete (header, sezioni, errori, whatsapp)
- `src/i18n/locales/en.json` — Traduzioni inglesi complete
- `src/state/languageAtom.ts` — Persistenza lingua via Jotai localStorage
- `src/common/LanguageSwitcher.tsx` — Toggle IT/EN nell'header

**Componenti migrati (100% i18n):**
- ✅ `src/header/index.tsx` — LanguageSwitcher integrato
- ✅ `src/sections/AtHome.tsx` — Pre-cerimonia completa
- ✅ `src/sections/WeAreWedding.tsx` — Header sposi
- ✅ `src/sections/WhereSection.tsx` — Cerimonia + ricevimento + calendario dinamico
- ✅ `src/sections/HotelSection.tsx` — Alloggi + raccomandazioni 
- ✅ `src/sections/GallerySection.tsx` — Foto + condivisione
- ✅ `src/sections/RSVPSection.tsx` — Form RSVP + validazione + errori + note
- ✅ `src/sections/GiftSection.tsx` — Lista nozze + dettagli bancari
- ✅ `src/sections/GuestbookSection.tsx` — Messaggi + form + timeAgo
- ✅ `src/types/family.ts` — getWhatsAppMessageI18n + getWhatsAppMessageReminderI18n

**Funzionalità:**
- ✅ Toggle lingua IT/EN persistente nell'header
- ✅ Tutte le UI tradotte con interpolazione dinamica
- ✅ Logica singolare/plurale nei messaggi WhatsApp
- ✅ Calendario con lingua dinamica (AddToCalendarButton)
- ✅ Gestione tempo relativo internazionalizzata
- ✅ Zero testi hardcoded rimanenti

**Bug risolti:**
- 🔧 Testi hardcoded sostituiti con pattern t() standardizzato
- 🔧 Supporto interpolazione variabili ({{count}}, {{familyId}}) 
- 🔧 Logica lingue integrate nelle utility functions

### ✅ Feature 3 — Dashboard RSVP con Grafici (COMPLETATA)

**Status:** Implementata e testata ✅  
**Data completamento:** 2026-04-21  
**File implementati:**
- `src/types/dashboard.ts` — Definizioni tipi dashboard (RSVPSummary, DashboardData, ChartData)
- `src/utils/rsvpStats.ts` — Funzioni utility per calcoli statistici e aggregazioni dati
- `src/hooks/useDashboard.ts` — Hook Firebase real-time per dati dashboard con fp-ts pattern
- `src/sections/DashboardSection.tsx` — Componente dashboard con charts, tabelle e PDF export
- `src/admin/Admin.tsx` — Refactoring con tabs (Dashboard, Gestione Famiglie, Guestbook, Report)

**Funzionalità:**
- ✅ Summary cards per statistiche RSVP (totali, confermati, percentuali)
- ✅ Bar chart per RSVP per lato (Alessio/Beatrice) con recharts
- ✅ Pie chart per stati di conferma (confermato/rifiutato/forse/in attesa)
- ✅ Tabella allergie e intolleranze alimentari con chips colorate
- ✅ Tabella preferenze cocktail con raggruppamento e popolarità
- ✅ Integrazione nell'Admin panel come primo tab
- ✅ Real-time data sync con onSnapshot Firebase
- ✅ Traduzioni complete IT/EN per tutte le UI
- ✅ Estensione modello dati FamilyMember (allergies, dietaryNotes, drinkPreference)

**Dipendenze aggiunte:**
- `recharts` — Libreria per charts React
- `jspdf` + `jspdf-autotable` — Generazione PDF reports (placeholder implementato)

**Architettura:**
- Pattern fp-ts con Option/Either per gestione errori
- Real-time sync Firestore con cleanup automatico
- Utility functions pure per aggregazioni statistiche
- Componenti modulari riutilizzabili (SummaryCard, AllergiesTable, CocktailTable)

**Prossima feature da implementare:** Feature 4 — Menu Digitale

---

## Naming Conventions

| Tipo | Convenzione | Esempio |
|---|---|---|
| Componenti React | PascalCase.tsx | `GiftSection.tsx` |
| Hook | useSomething.ts | `useFamilyData.ts` |
| Tipi semplici | camelCase | `familyId: string` |
| Tipi complessi/interfacce | PascalCase | `FamilyData`, `GuestbookEntry` |
| Atomi Jotai | somethingAtom.ts | `bootAnimationAtom.ts` |
| Documenti Firestore | lower_snake_case per collection, mixed per campi | collection `wedding`, campo `firstName` |
| File utility | camelCase.ts | `constants.ts`, `date.ts` |

---

## Criticità architetturali note

### 🔴 Bug

1. **useNeedToRefresh.ts** — Memory leak: il cleanup di `useEffect` rimuove `() => {}` (funzione anonima nuova) anziché `checkIfNeedToRefresh`. Il listener originale resta attivo per sempre. Inoltre la logica del timer è incoerente: `diff / (1000 * 60 * minutes)` con `minutes=30` produce un valore confrontato con `24`, quindi il refresh scatta dopo `24 * 30 = 720 minuti` (12 ore), non dopo 30 minuti.
2. **useWedding.ts** — `setInterval` fuori da `useEffect` (memory leak), nessun cleanup. Ogni render crea un nuovo interval senza cancellare i precedenti.

### 🟡 Problemi architetturali

3. **AddFamily.tsx** — Duplicazione stato: `members` (useState) e `familyData` (useState separato) con `members` array condiviso. `key={`member_${idx}`}` basata su index. Mutazione implicita: `newMms[idx].firstName = target.value` muta l'oggetto originale dentro l'array copiato con spread (shallow copy).
4. **FamilyRow.tsx** e **FamilyMembers.tsx** — `key: string` definito nel tipo props. `key` è una prop riservata React: viene consumata dal reconciler e mai passata al componente. Il campo è morto e crea confusione.
5. **constants.ts** — `containerWidth = Math.min(window.innerWidth, 700)` calcolato a livello di modulo (top-level, eseguito una volta all'import). Se la finestra viene ridimensionata, il valore non si aggiorna. Tutti i componenti dipendenti (`AnimatedCharacter`, `Container`, `GiftSection` via `aroundTheWorldAnimationWidth`) usano una dimensione potenzialmente stale.
6. **GiftSection.tsx** — Colori hardcoded (`#87f395aa`, `#14c4e1`), dati bancari in `constants.ts` anziché Firestore.
7. **WhatsAppWidget.tsx** — `window.open` senza `noopener`, zero gestione errori, contatti hardcoded, zero accessibilità (`Card` cliccabile senza `role="button"`).
8. **Report.tsx** — Chiavi aggregazione disallineate ("Alessio"/"Beatrice" vs dati reali).
9. **useAdmin.ts** — `useAdminData` ha `.catch(() => {})` vuoto: inghiotte silenziosamente errori Firestore. Il pannello admin non mostra feedback se il caricamento famiglie fallisce.
10. **useRestaurant.ts** — `isPrinting` esportato come `const isPrinting = false` — dead code o placeholder mai completato.

### 🟢 Colori fuori palette

Il theme definisce: primary `#3f51b5`, secondary `#f50057`, font `Dosis`, mode `light`.
I seguenti colori hardcoded non appartengono alla palette:
- `GiftSection.tsx`: `#87f395aa`, `#14c4e1`, `rgba(176,248,183,0.67)`, `#646262`, `#343434`
- `WhatsAppWidget.tsx`: `#44b700`, `rgba(252,252,252,0.8)`
- `FamilyRow.tsx`: `#0082e1`
- `HotelSection.tsx`: `white`, `black` (inline in style, non dal theme)

---

## Direttive operative

1. **Massima immutabilità** negli update — usare `immer` (già nel progetto)
2. **Zero duplicazione stato** — singola fonte di verità per ogni dato
3. **Zero key basate su index** — usare ID stabili
4. **Zero colori/spacing hardcoded** — tutto dal theme
5. **Zero testi hardcoded** — usare `t("sections.component.key")` con react-i18next obbligatorio
6. **Prima di creare un hook/funzione**, verificare se ne esiste già uno equivalente
7. **Prima di modificare un componente**, leggere l'intero file e descrivere la logica attuale
8. **Ogni nuovo componente/feature deve usare i18n** dal primo commit con traduzioni IT + EN
9. **Non modificare file critici senza conferma esplicita**: `App.tsx`, `SectionContainer.tsx`, `GiftSection.tsx`, `WhatsAppWidget.tsx`, `AddFamily.tsx`, `constants.ts`, `family.ts`

---

## Riferimenti ai layer di configurazione

Per contesto approfondito, Claude deve leggere i seguenti file quando rilevanti:

| Layer | File | Quando leggerlo |
|---|---|---|
| Rules (code style) | `.claude/rules/code-style.md` | Per ogni modifica o creazione codice |
| Rules (testing) | `.claude/rules/testing.md` | Quando si scrivono o modificano test |
| Rules (firebase) | `.claude/rules/firebase-conventions.md` | Per ogni interazione con Firestore |
| Skill: Refactor | `.claude/skills/code-refactor/SKILL.md` | Quando si fa refactoring |
| Skill: Firebase | `.claude/skills/firebase-engineer/SKILL.md` | Per query, regole, ottimizzazioni Firestore |
| Skill: UI/UX | `.claude/skills/ui-polish/SKILL.md` | Per modifiche UI, responsive, accessibilità |
| Skill: State Machine | `.claude/skills/state-machine/SKILL.md` | Per diagrammi stato, flussi, analisi |
| Agent: ReactRefactor | `.claude/agents/react-refactor.md` | Per refactoring componenti complessi |
| Agent: FirebaseEngineer | `.claude/agents/firebase-engineer.md` | Per lavoro intensivo su Firestore |
| Agent: UXPolisher | `.claude/agents/ux-polisher.md` | Per rifinitura UI/accessibilità |
| Feature Backlog | `CLAUDE_WEDDING_FEATURES.md` | Per implementazione nuove feature |

### Slash commands disponibili

| Comando | Scopo |
|---|---|
| `/project:review` | Analisi strutturata di un file/componente |
| `/project:fix-issue` | Fix con protocollo sicuro (leggi → proponi → conferma → applica) |
| `/project:add-feature` | Implementa feature dal backlog |
| `/project:analyze-state` | Genera diagramma stati Mermaid dell'app |
| `/project:test-flow` | Flusso di test completo (Fase I senza Firebase, Fase II con Firebase) |
| `/project:setup-git` | Inizializza Git e collega a GitHub |
| `/project:deploy` | Pre-deploy check + istruzioni Firebase Hosting |

---

## Infrastruttura

### Decisione architetturale: Firebase Hosting (non Render)

La scelta di hosting è stata risolta: **Firebase Hosting** è l'unica opzione coerente con lo stack.

**Motivazione:** L'app è una SPA React pura senza backend Node. Firebase è già il backend (Firestore + Auth). Render aggiungerebbe un layer senza valore. Firebase Hosting offre: HTTPS automatico, CDN globale, deploy via CLI, SPA rewrite nativo, piano gratuito (Spark) sufficiente per il volume atteso (decine/centinaia di utenti), zero carta di credito richiesta.

### Dominio: `weddingonline.it` su Register.it

**Registrar:** Register.it
**Pannello DNS:** https://controlpanel.register.it/domains/dns.html
**DNSSEC:** Abilitato (25/03/2026). Se si mantengono i nameserver di Register.it (ns1/ns2.register.it), DNSSEC resta attivo. Se si cambiassero nameserver, verrebbe disabilitato automaticamente. Per Firebase Hosting non serve cambiare nameserver.

#### Configurazione DNS attuale (default Register.it)

| Nome | Tipo | Valore | Scopo |
|---|---|---|---|
| `weddingonline.it` | A | `195.110.124.133` | ⚠️ DA MODIFICARE — punta all'hosting Register.it |
| `www.weddingonline.it` | CNAME | `weddingonline.it` | OK — segue il root |
| `ftp.weddingonline.it` | CNAME | `weddingonline.it` | Non necessario, può restare |
| `weddingonline.it` | MX 10 | `mail.register.it` | ⛔ NON TOCCARE — gestisce la posta |
| `pec.weddingonline.it` | MX 10 | `server.pec-email.com` | ⛔ NON TOCCARE — PEC |
| `pop.weddingonline.it` | CNAME | `mail.register.it` | ⛔ NON TOCCARE — posta |
| `autoconfig.weddingonline.it` | CNAME | `tb-it.securemail.pro` | ⛔ NON TOCCARE — autoconfig mail |
| TXT (SPF) | TXT | `v=spf1 include:spf.webapps.net ~all` | ⛔ NON TOCCARE — autorizzazione invio email |
| SRV autodiscover | SRV | `10 10 443 ms-it.securemail.pro` | ⛔ NON TOCCARE — autodiscover mail |

#### Istruzioni di configurazione DNS per Firebase Hosting

**Procedura:**

1. **Console Firebase** → Hosting → "Add custom domain" → inserire `weddingonline.it`
2. Firebase chiede di **verificare la proprietà del dominio** aggiungendo un record TXT:
   - Su Register.it → Gestione avanzata DNS → aggiungere il record TXT fornito da Firebase
3. Dopo la verifica, Firebase fornisce **due IP per i record A**
4. Su Register.it → Gestione avanzata DNS:
   - **Modificare** il record A di `weddingonline.it` da `195.110.124.133` ai due IP forniti da Firebase (uno alla volta, creando due record A)
   - **Lasciare invariato** il CNAME `www.weddingonline.it → weddingonline.it` (segue automaticamente il nuovo A)
   - **NON toccare** nessun record MX, PEC, TXT SPF, SRV, autoconfig, pop — sono tutti per la posta
5. Attendere propagazione DNS (fino a 48h, tipicamente 1-4h)
6. Firebase genera e rinnova automaticamente il certificato SSL per `weddingonline.it` e `www.weddingonline.it`
7. Ripetere per `www.weddingonline.it` se Firebase lo richiede come dominio separato

**Regola critica:** modificare SOLO il record A di `weddingonline.it`. Tutto il resto deve restare invariato per non interrompere la posta (`info@weddingonline.it` e PEC).

[Non verificato] Gli IP forniti da Firebase per i record A cambiano per ogni progetto e vengono mostrati nella console al momento della configurazione. Non sono valori fissi universali.

#### Backup DNS (prima di modificare)

Esportare il CSV della zona DNS attuale da Register.it (Gestione avanzata → Esporta) prima di qualsiasi modifica. Conservare come `dns-backup-YYYYMMDD.csv` nella root del progetto (gitignored). Permette rollback rapido in caso di errore.

### Routing con dominio personalizzato

Il routing attuale (pathname parsing in `App.tsx`, NON React Router) funziona nativamente con Firebase Hosting grazie al rewrite. Il codice non richiede modifiche per il dominio personalizzato.

**`firebase.json`** (nella root del progetto, stesso livello di `package.json`):
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

**Flusso di una richiesta:**
1. Browser richiede `https://weddingonline.it/ABC123`
2. DNS (Register.it) risolve `weddingonline.it` → IP Firebase CDN
3. Firebase Hosting riceve la richiesta, il rewrite serve `index.html`
4. React si carica, `useFamilyData` estrae `ABC123` dal pathname
5. Firebase Auth anonima → Firestore `getDoc("wedding", "ABC123")` → render sezioni

**URL risultanti:**
- `https://weddingonline.it/{familyId}` → invito della famiglia
- `https://weddingonline.it/admin?password=X` → pannello admin
- `https://weddingonline.it/restaurant?password=X` → gestione tavoli

### Configurazione Firebase (credenziali)

Le credenziali del progetto Firebase (`firebaseConfig` in `App.tsx`) devono essere popolate con i valori reali dalla console Firebase (Project Settings → General → Your apps → Firebase SDK snippet). Questi valori non sono segreti (sono visibili nel bundle client-side) ma non devono contenere dati sensibili. La sicurezza è garantita dalle Firestore Security Rules, non dall'oscuramento delle credenziali.

### Email di dominio

Register.it fornisce 3 caselle email da 2GB incluse con il dominio. La casella `info@weddingonline.it` è stata configurata. I record MX, SPF, autoconfig e PEC non devono essere modificati durante la configurazione del DNS per Firebase Hosting.

---

## Context Persistence

Claude deve mantenere consapevolezza di:
- Struttura completa del progetto (cartelle, file, dipendenze)
- Logica routing condizionale (pathname parsing, NO React Router)
- Logica RSVP (form → Firestore → conferma → confetti)
- **Logica Guestbook** (real-time messaging, auth anonima, moderazione admin)
- **Sistema i18n completo** (react-i18next, LanguageSwitcher, pattern t(), zero hardcoded text)
- Sistema animazioni (Lottie per vettoriali, Framer Motion per transizioni, Confetti per particelle)
- Stato temporale wedding (`isWeddingStarted`, `isPartyStarted`, `isWeddingOver`)
- Criticità architetturali elencate sopra
- **Feature implementate** (Feature 1 - Guestbook, Feature 2 - i18n completate al 100%)
- Feature backlog completo in `CLAUDE_WEDDING_FEATURES.md`
- Infrastruttura: Firebase Hosting su dominio `weddingonline.it`
