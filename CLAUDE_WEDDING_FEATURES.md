# CLAUDE.md — Feature Backlog per my-wedding-day

## Contesto di progetto

Applicazione React 18 con TypeScript per wedding planner interattivo serverless. Ogni feature descritta qui deve rispettare lo stack e i pattern architetturali esistenti.

### Stack tecnologico vincolante

| Tecnologia | Versione | Ruolo |
|---|---|---|
| React | 18.2.0 | Framework UI (CRA/Webpack, NO Next.js, NO SSR) |
| TypeScript | 5.0.2 | Tipizzazione statica |
| Material-UI | 5.11.13 | Componenti UI con theme-styling custom (`src/theme.ts`) |
| Jotai | 2.0.3 | State management atom-based |
| Firebase | 9.18.0 | Backend: Firestore + Auth |
| Framer Motion | 10.12.10 | Animazioni e transizioni |
| fp-ts | 2.13.1 | Programmazione funzionale (Option, Either, TaskEither) |
| Lottie React | 2.4.0 | Animazioni JSON |
| react-confetti-explosion | — | Animazione particellare (già in uso in GiftSection, RSVPSection) |
| react-responsive-carousel | — | Carousel immagini (già in uso in GallerySection) |
| immer | — | Immutable state updates (già in uso in RSVPSection) |

### Pattern architetturale da rispettare

- Ogni feature = sezione in `src/sections/` + hook in `src/hooks/` + tipo in `src/types/`
- Dati remoti → hook Firebase custom. Stato locale/cache → atomi Jotai
- UI → componenti MUI con colori/spacing/typography dal theme (`src/theme.ts`). Zero valori hardcoded
- Errori → `fp-ts`: `Option<T>` per nullable, `Either<Error, T>` per fallibili, `TaskEither` per async Firebase
- Animazioni → Framer Motion per transizioni UI. Lottie per animazioni vettoriali complesse
- Asset statici (serviti come URL) → `public/`. Asset importati nel bundle → `src/images/`
- Routing → condizionale implicito in `App.tsx` (NO react-router). Admin e Restaurant sono modalità alternative
- Componenti riutilizzabili → `src/common/`

### Modello dati esistente (riferimento)

```typescript
// src/types/family.ts
export type FamilyMember = {
  firstName: string;
  lastName: string;
  recipient: boolean;
  isChild: boolean;
  infant?: boolean;
  sex: "male" | "female";
  rsvp: "yes" | "no" | "maybe" | "unknown";
  table?: { tableId: string; note?: string | null } | null;
};

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

### Stato temporale dell'app (da `useWedding.ts`)

L'app ha tre fasi temporali che condizionano il rendering in `App.tsx`:
- `isWeddingStarted`: dopo il 24/07/2027
- `isPartyStarted`: dopo il 24/07/2027 ore 19:30
- `isWeddingOver`: dal 25/07/2027

Queste fasi determinano quali sezioni sono visibili. Ogni nuova feature deve dichiarare in quale fase è attiva.

### Composizione attuale di App.tsx (rendering condizionale)

```
Se admin → <Admin />
Se restaurant → <Restaurant />
Se !result || !elapsed → <LoadingMask />
Se isWeddingOver → <WeddingIsOver />
Se result.kind === "error" → <ErrorMask />

Altrimenti:
  <Container>
    <Header />
    <WeAreWedding />
    {isPartyStarted && <GallerySection />}
    {!isPartyStarted && <AtHome />}
    <WhereSection onlyInfo={result.data.onlyInfo} />
    {!result.data.onlyInfo && !isWeddingStarted && (
      <RSVPSection familyData={result.data} />
      <HotelSection />
    )}
    <GiftSection />
    {!isPartyStarted && <GallerySection />}
  </Container>
```

### Componenti esistenti (non duplicare)

| Componente | Cosa fa già |
|---|---|
| `GiftSection.tsx` | Lista nozze con IBAN (da `constants.ts`), copia negli appunti via `navigator.clipboard`, confetti (`react-confetti-explosion`), animazione Lottie world→japan toggle, transizione `Slide` MUI per mostrare/nascondere dati bancari. Nessun payment provider. Sotto-componente `BankDetail` con `Table`/`TableRow`/`TableCell` per riga bancaria. |
| `WhatsAppWidget.tsx` | Link diretto `wa.me` con badge animato "online" (ripple CSS). Contatti hardcoded (Beatrice/Alessio con numeri e SVG avatar). `window.open` senza `noopener`. Nessuna gestione errori. Nessuna automazione. Responsive column/row via `useMediaQuery`. |
| `GallerySection.tsx` | Carousel `react-responsive-carousel` con 2 placeholder SVG + bottone link a album esterno (`window.open`). Completamente statico, zero hook, zero stato. |
| `RSVPSection.tsx` | Form conferma presenza per membro famiglia con checkbox yes/no, sync Firestore via `useUpdateFamilyData`, confetti, `WhatsAppWidget` integrato, `YouHaveToConfirm` sub-component. Usa `immer` per update immutabili. |
| `Report.tsx` | Aggregazione dati RSVP: conteggi yes/no/unknown, split per side (Alessio/Beatrice), export CSV via `jsonexport`. Solo numeri testuali, nessun grafico. Usa `useLoadTables` per dati tavoli. |
| `WeAreWedding.tsx` | Sezione presentazione coppia. |
| `WhereSection.tsx` | Info su cerimonia/ricevimento con mappa. |
| `HotelSection.tsx` | Info hotel con link esterno. Componente dichiarativo. |
| `AtHome.tsx` | Sezione statica pre-wedding. Props vuote, zero logica. |
| `WeddingIsOver.tsx` | Schermata di fine evento. Statica, zero stato. Font Gwendolyn. |

---

## FEATURE 1 — Guestbook (Bacheca Messaggi Ospiti)

**Fonte:** WedStack (guestbook for leaving messages, stored in MongoDB → tradotto in Firestore)

**Fase attiva:** pre-wedding e post-wedding (sempre visibile tranne `isWeddingOver`)

### Cosa fa

Permette agli ospiti di lasciare un messaggio di auguri. I messaggi vengono persistiti su Firestore e visualizzati in una bacheca pubblica scorrevole in tempo reale.

### File da creare

**`src/types/guestbook.ts`**
```typescript
export interface GuestbookEntry {
  id: string;
  familyId: string;
  authorName: string;
  message: string;
  createdAt: Date;
}
```

**`src/hooks/useGuestbook.ts`**
- Espone: `messages: GuestbookEntry[]`, `sendMessage: (authorName: string, text: string) => TaskEither<Error, void>`, `loading: boolean`
- Lettura: `onSnapshot` sulla collection `guestbook` ordinata per `createdAt` desc → aggiornamento real-time
- Scrittura: `addDoc` con `familyId` derivato dal contesto utente corrente
- Max 500 caratteri per messaggio (validazione client-side)

**`src/sections/GuestbookSection.tsx`**
- Input: `TextField` MUI multiline + contatore caratteri (500 max)
- Lista messaggi: `Card` MUI con nome, messaggio, data (formattata via `src/utils/date.ts`)
- Animazione ingresso: Framer Motion `AnimatePresence` + `motion.div` con `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- Bottone invio: `Button` MUI `contained`, colore dal theme

**Collection Firestore:** `guestbook`
```
{
  id: string (auto),
  familyId: string,
  authorName: string,
  message: string (max 500),
  createdAt: Timestamp
}
```

**Regole Firestore:**
- Scrittura: solo utenti autenticati (familyId deve corrispondere)
- Lettura: pubblica
- Cancellazione: solo da admin

**Estensione admin:** Aggiungere in `src/admin/Admin.tsx` vista per moderare (visualizzare + cancellare) messaggi.

**Posizionamento in App.tsx:** Dopo `<GiftSection />`, prima dell'ultimo `<GallerySection />`.

---

## FEATURE 2 — Internazionalizzazione (i18n) Multi-Lingua

**Fonte:** WedStack (multi-language toggle PT/EN, descritto come "resilient and scalable")

**Fase attiva:** sempre

### Cosa fa

Toggle per passare tra IT e EN. Tutti i testi statici dell'interfaccia estratti in file JSON per lingua.

### File da creare

**Nuovi pacchetti npm:** `react-i18next`, `i18next`

**`src/i18n/index.ts`** — Configurazione i18next:
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import it from './locales/it.json';
import en from './locales/en.json';

i18n.use(initReactI18next).init({
  resources: {
    it: { translation: it },
    en: { translation: en },
  },
  lng: 'it',
  fallbackLng: 'it',
  interpolation: { escapeValue: false },
});

export default i18n;
```

**`src/i18n/locales/it.json`** e **`src/i18n/locales/en.json`** — Struttura chiavi per tutte le sezioni:
```json
{
  "header": { "title": "...", "subtitle": "..." },
  "sections": {
    "rsvp": { "title": "...", "confirm": "...", "decline": "..." },
    "where": { "title": "...", "ceremony": "...", "reception": "..." },
    "gift": { "title": "...", "cta": "..." },
    "guestbook": { "title": "...", "placeholder": "...", "send": "..." },
    "menu": { "title": "..." },
    "gallery": { "title": "...", "share": "..." },
    "hotel": { "title": "..." }
  },
  "common": { "copied": "...", "loading": "...", "error": "..." }
}
```

**`src/common/LanguageSwitcher.tsx`**
- `ToggleButtonGroup` MUI con opzioni IT | EN
- Chiama `i18n.changeLanguage()`
- Posizionamento: header dell'app, sempre visibile

**`src/state/languageAtom.ts`**
```typescript
import { atomWithStorage } from 'jotai/utils';
export const languageAtom = atomWithStorage<'it' | 'en'>('lang', 'it');
```
Sincronizzare con `i18n.changeLanguage` tramite `useEffect` in `LanguageSwitcher` o nel componente root.

**Inizializzazione:** Importare `src/i18n/index.ts` in `src/index.tsx` prima del render di `<App />`.

**Effort di migrazione:** Tutti i testi hardcoded in `src/sections/*.tsx`, `src/common/*.tsx`, `src/header/*.tsx` vanno sostituiti con `t('chiave')`. Operazione meccanica ma pervasiva. Include anche i messaggi WhatsApp in `src/types/family.ts` (`getWhatsAppMessage`, `getWhatsAppMessageReminder`).

---

## FEATURE 3 — Dashboard RSVP con Grafici e PDF

**Fonte:** michax/next.js-wedding-template-v1 (dashboard summary page con risultati form + PDF download) + docx [TBC] "Programmare una dashboard" + [TBC] "Programmare un istogramma e un pie-diagram" + [TBC] "tracciare lista allergie e cocktail"

**Fase attiva:** solo in modalità admin

### Cosa fa

Estende l'attuale `Report.tsx` (che fa solo conteggi numerici + export CSV) con una dashboard visuale contenente: summary cards, istogramma RSVP per side, pie chart confermati/rifiutati/pending, tabella allergie aggregate, report PDF scaricabile.

### Specifiche

**Nuovi pacchetti npm:** `recharts` (grafici React dichiarativi), `jspdf` + `jspdf-autotable` (generazione PDF client-side)

**Nuovo componente:** `src/admin/Dashboard.tsx`

**Summary Cards (parte superiore):**
- Totale invitati, confermati, rifiutati, in attesa
- Dati già calcolati in `Report.tsx` (`totalMemberInvited`, `membersYes`, `membersNo`, `membersUnknown`) → estrarre logica di aggregazione in `src/utils/rsvpStats.ts` per riuso tra `Report.tsx` e `Dashboard.tsx`
- Card: `Paper` MUI con `Typography` numero + label
- Layout: `Grid` MUI, 4 colonne desktop, 2 mobile

**Istogramma RSVP per side:**
- `BarChart` di recharts
- Asse X: "Alessio" / "Beatrice" (i valori di `FamilyData.side`)
- Barre raggruppate: yes (verde), no (rosso), unknown (grigio)
- Dati derivati: raggruppare `familiesWithRSPV` per `side`, contare `rsvp` per ogni gruppo

**Pie Chart stato conferme:**
- `PieChart` di recharts
- 3 segmenti: yes, no, unknown con colori coerenti al theme

**Tabella allergie aggregate:**
- Richiede estensione `FamilyMember` (vedi sotto)
- `Table` MUI con colonne: Allergia | Conteggio | Nomi
- Raggruppa per allergia, conta occorrenze, elenca nomi

**Tabella cocktail (opzionale):**
- Come da docx [TBC]: "tracciare la lista di tutti i cocktail presi la sera"
- Richiede nuovo campo in modello dati (vedi sotto)
- Stessa struttura della tabella allergie

**Download PDF report:**
- Bottone "Scarica Report PDF"
- `jspdf` + `jspdf-autotable` per generazione client-side
- Contenuto: titolo evento, data, tabella riepilogativa RSVP, conteggi per side, lista allergie

### Estensione modello dati necessaria

In `src/types/family.ts`, aggiungere a `FamilyMember`:
```typescript
allergies?: string[];       // es. ["glutine", "lattosio"]
dietaryNotes?: string;      // note libere (vegetariano, vegano, etc.)
drinkPreference?: string;   // es. "Spritz", "Gin Tonic" (per tracciamento cocktail)
```

Questa estensione ha impatto su:
- `RSVPSection.tsx` — aggiungere campi al form di conferma
- `AddFamily.tsx` — aggiungere campi alla creazione membro
- Firestore collection `wedding` — nuovi campi nei documenti

**Non modificare questi file senza conferma esplicita.**

### Integrazione in admin

`Dashboard.tsx` viene reso disponibile dentro `Admin.tsx` come tab/sezione aggiuntiva (es. `Tabs` MUI con "Famiglie" | "Dashboard" | "Report CSV"). `Report.tsx` attuale rimane intatto per l'export CSV; la dashboard è la vista visuale complementare.

---

## FEATURE 4 — Condivisione Foto Ospiti (Google Drive + QR Code)

**Fonte:** docx [TBC] "Integrazione con Google photo (o opzioni gratuite) per gli invitati"

**Fase attiva:** da `isPartyStarted` in poi (visibile durante e dopo la festa)

### Cosa fa

Presenta un QR code che punta a una cartella Google Drive condivisa ("chiunque abbia il link può modificare") dove gli ospiti caricano foto e video. Non richiede API Google né autenticazione lato ospite.

### Specifiche (approccio dal docx)

Setup manuale one-time: creare cartella Google Drive → impostare "chiunque abbia il link può modificare" → copiare link.

**Configurazione Firestore:**
```
Document: config/photoSharing
{
  driveUrl: "https://drive.google.com/drive/folders/XXXX",
  enabled: boolean
}
```

**Nuovo pacchetto npm:** `qrcode.react`

**`src/hooks/usePhotoSharing.ts`**
- Legge `config/photoSharing` da Firestore con `getDoc` (one-shot, non serve real-time)
- Espone: `driveUrl: string | null`, `enabled: boolean`, `loading: boolean`

**Integrazione in `GallerySection.tsx` o nuovo `src/sections/PhotoSharingSection.tsx`:**
- `QRCodeSVG` di `qrcode.react` con `value={driveUrl}`, dimensione responsive
- Testo: "Hai fatto delle foto? Scansiona per condividere!" (localizzato via i18n se Feature 2 implementata)
- `Button` MUI con link diretto al Drive (fallback per chi non può scansionare)
- Render condizionale: visibile solo se `isPartyStarted === true && enabled === true`

**Nessuna API Google necessaria.** L'app mostra solo il QR code verso una risorsa configurata esternamente.

---

## FEATURE 5 — Spotify Playlist Condivisa

**Fonte:** docx [TBC] "Collegare a Spotify API"

**Fase attiva:** pre-wedding (suggerimenti brani) e durante la festa

### Cosa fa

Permette agli ospiti di scoprire e contribuire alla playlist del matrimonio.

### Approccio consigliato — Senza API Spotify

Stessa logica della Feature 4: creare playlist collaborativa su Spotify, condividere link, mostrare nell'app con QR code + embed.

**Configurazione Firestore:**
```
Document: config/playlist
{
  spotifyUrl: "https://open.spotify.com/playlist/XXXX",
  enabled: boolean
}
```

**`src/hooks/usePlaylist.ts`**
- Legge `config/playlist` da Firestore con `getDoc`
- Espone: `spotifyUrl: string | null`, `enabled: boolean`

**UI (nuova sezione o integrata in sezione esistente):**
- Embed Spotify iframe:
```html
<iframe
  src="https://open.spotify.com/embed/playlist/XXXX"
  width="100%"
  height="380"
  frameBorder="0"
  allow="encrypted-media"
/>
```
- QR code al link Spotify (usa `qrcode.react`, già richiesto dalla Feature 4)
- Testo invito a contribuire alla playlist

**Nessun pacchetto aggiuntivo** oltre a `qrcode.react` (condiviso con Feature 4).

### Approccio alternativo — Con API Spotify

Richiede: app Spotify Developer, OAuth flow, Spotify Web API per ricerca + aggiunta brani, Firebase Cloud Function come proxy per token refresh. **Sconsigliato:** costi non nulli, complessità elevata, risultato UX marginalmente superiore.

---

## FEATURE 6 — Anteprima Menù Ristorante

**Fonte:** WedStack (menu preview with design-matched layout)

**Fase attiva:** pre-wedding (informativa) e durante il matrimonio

### Cosa fa

Mostra il menù del ricevimento con layout grafico coerente. Il progetto ha già `src/restaurant/` con logica tavoli (`Tables.tsx`, `CreateNewTable.tsx`) ma nessun componente dedicato al contenuto del menù.

### File da creare

**`src/types/menu.ts`**
```typescript
export type CourseType = 'antipasto' | 'primo' | 'secondo' | 'dolce' | 'bevande';

export interface MenuItem {
  id: string;
  course: CourseType;
  name: string;
  description: string;
  allergens: string[];
  order: number;
}
```

**Collection Firestore:** `menu`
```
{
  id: string,
  course: CourseType,
  name: string,
  description: string,
  allergens: string[],
  order: number
}
```

**`src/hooks/useMenu.ts`**
- Espone: `menuItems: MenuItem[]`, `loading: boolean`
- Legge collection `menu` ordinata per `order` con `getDocs` (statico, non serve real-time)
- Raggruppa per `course` lato client

**`src/sections/MenuSection.tsx`**
- Layout a blocchi verticali, un blocco per portata
- Titolo portata: `Typography variant="h5"` + `Divider` MUI
- Piatto: nome `Typography subtitle1` bold, descrizione `Typography body2`
- Allergens: `Chip` MUI piccoli colorati per ogni allergene
- Animazione: Framer Motion stagger con `variants` + `staggerChildren`

**`src/admin/MenuEditor.tsx`** — CRUD piatti del menù (admin only)

**Posizionamento in App.tsx:** Prima o dopo `<WhereSection />`, coerente con il flusso informativo.

**Collegamento con RSVP (opzionale):** Se `FamilyMember` viene esteso con `allergies[]` (Feature 3), il menù può evidenziare piatti compatibili per l'ospite loggato. Richiede conferma prima di implementare.

---

## FEATURE 7 — Navigazione a Carousel Infinito tra Sezioni

**Fonte:** WedStack (page navigation arrows, infinite carousel style)

**Fase attiva:** sempre (tranne `isWeddingOver`)

### Cosa fa

Frecce di navigazione fisse per scorrere tra le sezioni. Raggiunta l'ultima, "avanti" riporta alla prima.

### File da creare

**`src/state/activeSectionAtom.ts`**
```typescript
import { atom } from 'jotai';
export const activeSectionAtom = atom<number>(0);
```

**`src/common/SectionNavigator.tsx`**
- Due `IconButton` MUI (KeyboardArrowUp / KeyboardArrowDown) in `position: fixed`, lato destro, centrati verticalmente
- Click: aggiorna `activeSectionAtom` con `(current + 1) % totalSections` o `(current - 1 + totalSections) % totalSections`
- Esegue `document.getElementById('section-' + index).scrollIntoView({ behavior: 'smooth' })`
- Opzionale: dot indicator verticale (pallini sezione corrente) — `Box` con `borderRadius: '50%'`, colore attivo/inattivo dal theme

**Modifiche richieste a `App.tsx` e/o `SectionContainer.tsx`:**
- Ogni sezione wrappata con `<div id={'section-' + index}>`
- `IntersectionObserver` per aggiornare `activeSectionAtom` durante scroll manuale (sincronizzazione bidirezionale tra scroll e frecce)

**Non modificare `App.tsx` né `SectionContainer.tsx` senza conferma.** Documentare le modifiche necessarie e attendere istruzione.

---

## FEATURE 8 — Sfondi SVG Dinamici per Sezione

**Fonte:** WedStack (dynamic SVG backgrounds per section)

**Fase attiva:** sempre

### Cosa fa

Ogni sezione ha uno sfondo SVG decorativo dedicato. Il progetto ha già asset SVG in `public/sections/` (`church.svg`, `home.svg`, `map.svg`, `resort.svg`, `restaurant.svg`) ma questi sono icone/illustrazioni di sezione, non sfondi full-bleed.

### File da creare

**`public/backgrounds/`** — Nuova cartella:
```
public/backgrounds/
├── bg-rsvp.svg
├── bg-ceremony.svg
├── bg-reception.svg
├── bg-gift.svg
├── bg-guestbook.svg
├── bg-hotel.svg
├── bg-gallery.svg
└── bg-menu.svg
```

Requisiti SVG: pattern vettoriali leggeri (< 50KB ciascuno), `viewBox` responsive, colori coerenti con il theme. Generabili con Haikei (blob/wave/gradient), SVGator, o a mano.

### Modifica a `SectionContainer.tsx`

Aggiungere prop opzionale:
```typescript
interface SectionContainerProps {
  backgroundSvg?: string;   // percorso relativo es. "/backgrounds/bg-rsvp.svg"
  overlayOpacity?: number;   // default 0.7
  children: React.ReactNode;
}
```
- `backgroundImage: url(${backgroundSvg})` con `backgroundSize: cover`, `backgroundPosition: center`
- Overlay semitrasparente: `Box` con `position: absolute`, `inset: 0`, `backgroundColor` dal theme con alpha variabile per leggibilità testo
- Fade-in: Framer Motion `motion.div` con `animate={{ opacity }}` al primo ingresso nel viewport

**Non modificare `SectionContainer.tsx` senza conferma.**

---

## FEATURE 9 — Refactoring Logica Bancaria (GiftSection)

**Fonte:** docx [TBC] "gestire logica bancaria" (contiene già specifiche dettagliate e codice)

**Fase attiva:** sempre (modifica a componente esistente)

### Cosa fa

Sposta i dati bancari da oggetto hardcoded in `constants.ts` a Firestore, con tipo dedicato e hook, e condiziona la visualizzazione IBAN all'esistenza di un'intenzione economica nel modello dati.

### Specifiche (dal docx, già dettagliate)

**`src/types/bank.ts`** (nuovo):
```typescript
export type BankAccount = {
  iban: string;
  owner: string;
  bicSwift?: string;
};
```

**Document Firestore:** `config/bank`
```json
{
  "iban": "...",
  "owner": "Alessio Sopranzi",
  "bicSwift": "..."
}
```

**`src/hooks/useBank.ts`** (nuovo):
```typescript
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { BankAccount } from "../types/bank";

export const useBank = () => {
  const [bank, setBank] = useState<BankAccount | null>(null);

  useEffect(() => {
    const fetchBank = async () => {
      const db = getFirestore();
      const ref = doc(db, "config", "bank");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setBank(snap.data() as BankAccount);
      }
    };
    fetchBank();
  }, []);

  return bank;
};
```

**Modifiche a `GiftSection.tsx`:**
- Sostituire `import { bank } from "../utils/constants"` con `const bank = useBank()`
- Condizionare visualizzazione: `{familyData?.gift !== undefined && bank && (<BankDetails />)}`
- Gestire stato loading del hook (mostrare skeleton o nulla mentre carica)

**Modifiche a `constants.ts`:**
- Rimuovere l'oggetto `bank` dopo la migrazione

**Non modificare `GiftSection.tsx` né `constants.ts` senza conferma.**

---

## FEATURE 10 — Fix Sicurezza e Errori WhatsAppWidget

**Fonte:** docx [TBC] "implicazioni di sicurezza (window.opener)" + [TBC] "non c'è la gestione degli errori"

**Fase attiva:** sempre (modifica a componente esistente)

### Fix 1 — Sicurezza `window.opener`

Attualmente `window.open(url)` in `handleOnClick` apre WhatsApp senza specificare target né `noopener`. La pagina aperta può accedere a `window.opener` e manipolare la pagina originale.

**Correzione:**
```typescript
window.open(url, '_blank', 'noopener,noreferrer');
```

### Fix 2 — Gestione errori

Attualmente nessun errore è gestito.

**Correzioni:**
- **Avatar mancante:** Aggiungere fallback — `<Avatar>` senza `src` mostra iniziale del nome (comportamento default MUI). Aggiungere `alt={name}` per accessibilità.
- **Numero malformato:** Validazione regex minima formato E.164 (`/^\+[1-9]\d{1,14}$/`) prima di costruire URL. Se invalido, non rendere il componente o mostrare stato disabilitato.
- **Accessibilità:** La `Card` cliccabile non ha `role="button"` né gestione tastiera. Aggiungere: `role="button"`, `tabIndex={0}`, `onKeyDown` per Enter/Space.

### Fix 3 — Esternalizzare contatti da codice

Attualmente i contatti ("Beatrice" `+393331983242` / "Alessio" `+393201950043` con `./header/giulia.svg` e `./header/mario.svg`) sono hardcoded nel componente.

**Opzione minima:** Spostare in `constants.ts` come array tipizzato:
```typescript
export type WhatsAppContact = {
  name: string;
  number: string;
  image: string;
};
export const whatsAppContacts: WhatsAppContact[] = [...];
```

**Opzione coerente con Feature 9:** Spostare in Firestore `config/contacts` e creare hook `useContacts.ts`.

**Non modificare `WhatsAppWidget.tsx` senza conferma.**

---

## FEATURE 11 — Fix Criticità AddFamily.tsx

**Fonte:** docx [TBC] "Criticità AddFamily.tsx"

**Fase attiva:** admin

### Problemi identificati nel docx

1. **Duplicazione stato** tra `members` (stato locale) e `familyData` (stato Firestore) → desincronizzazione
2. **Uso di index come key** nei componenti dinamici della lista membri → riconciliazione non ottimale su add/remove
3. **Mutazione implicita** degli oggetti membro durante update → viola immutabilità React

### Problemi confermati dalla lettura del codice sorgente

La mutazione è confermata: ogni `onChange` fa `const newMms = [...mms]; newMms[idx].firstName = target.value;` — lo spread copia l'array ma non gli oggetti interni (shallow copy), quindi `newMms[idx]` è lo stesso oggetto reference di `mms[idx]`. La mutazione avviene sull'oggetto originale.

Correlato: `FamilyMembers.tsx` usa `key={`${id}_${idx}`}` (index-based) e ha `key: string` nel tipo props (prop riservata React, morta — vedi FIX B).

### Correzioni

1. **Singola fonte di verità:** Eliminare stato locale duplicato, derivare tutto da `familyData` con trasformazioni pure
2. **Key stabile:** Usare `member.firstName + "_" + member.lastName` o UUID generato alla creazione come key (non index)
3. **Immutabilità con `immer`** (già nel progetto, usato in `RSVPSection.tsx`):
```typescript
import produce from "immer";
const updatedMembers = produce(members, draft => {
  draft[index].firstName = newValue;
});
```

**Non modificare `AddFamily.tsx` senza conferma.**

---

## FEATURE 12 — Automazione Post-Conferma (WhatsApp / Email)

**Fonte:** WedStack ("CRM-style automation — auto-email/WhatsApp after confirmation", menzionata come desiderata ma non implementata)

**Fase attiva:** pre-wedding (trigger post conferma RSVP)

### Cosa fa

Dopo conferma RSVP, invio messaggio di conferma con dettagli logistici.

### Percorso A — WhatsApp assistito (zero infrastruttura aggiuntiva, consigliato)

L'app ha già `getWhatsAppMessage` e `getWhatsAppMessageReminder` in `src/types/family.ts` che generano messaggi preformattati con link personale.

**Estensione nel pannello admin (`FamilyRow.tsx`):**
- Aggiungere bottone "Invia conferma WhatsApp" che apre `wa.me` con messaggio di conferma precompilato specifico post-RSVP
- L'invio resta manuale (l'admin clicca il bottone, si apre WhatsApp, l'admin preme invio) ma il messaggio è generato automaticamente
- Nuovo generator in `src/types/family.ts`:
```typescript
export const getWhatsAppConfirmation = (data: FamilyData): string => {
  const single = data.members.length === 1;
  const confirmed = data.members.filter(m => m.rsvp === "yes").map(m => m.firstName);
  return `Grazie per aver confermato! ${confirmed.join(", ")} ${single ? "è" : "sono"} ${single ? "confermato/a" : "confermati"} per il 24 Luglio 2027. Vi aspettiamo! 🎉`;
};
```

### Percorso B — Email automatica (richiede Cloud Function)

**Firebase Cloud Function:** `functions/src/onRsvpConfirmed.ts`
- Trigger: `onUpdate` sulla collection `wedding`
- Quando `rsvp` cambia a `"yes"` → scrive documento in collection `mail`
- Extension Firebase `firestore-send-email` invia via SMTP

**Prerequisito:** Campo `email: string` in `FamilyData` o `FamilyMember`. Attualmente assente → richiede estensione tipo + modifica form RSVP.

### Percorso C — WhatsApp automatico (Twilio)

Richiede Twilio WhatsApp API + Cloud Function. Costi non nulli. **Sconsigliato per il contesto.**

---

## FEATURE 13 — Personalizzazione Animazione Lottie (Tema Coreano)

**Fonte:** docx [TBC] "Modifica animazione japan.json to kore.json"

**Fase attiva:** sempre (usata in `GiftSection.tsx`)

### Cosa fa

Sostituisce l'animazione `japan.json` (mostrata quando si aprono i dati bancari) con una variante a tema coreano.

### Palette coreana obangsaek (dal docx)

| Nome | Hangul | Hex |
|---|---|---|
| Blu | 청색 | #1C3F95 |
| Rosso | 적색 | #C92E2E |
| Giallo | 황색 | #E2B200 |
| Bianco | 백색 | #FFFFFF |
| Nero | 흑색 | #000000 |

### Elementi da modificare

- Tempio coreano (hanok) al posto del castello
- Lanterne tradizionali coreane (cheongsachorong)
- Montagna Bukhansan / paesaggio coreano

### Workflow

1. Importare `src/animation/japan.json` in Lottielab (lottielab.com/editor, piano free)
2. Modificare shapes, colori (palette obangsaek), layer
3. Esportare come **Lottie JSON** (NON .dotLottie). Attivare "Preserve original structure"
4. Salvare come `src/animation/korea.json`
5. In `GiftSection.tsx`: sostituire `import japanAnimation from "../animation/japan.json"` con `import koreaAnimation from "../animation/korea.json"`

**Alternativa dal docx:** Usare After Effects con licenza floating dentro Creative Cloud per modifiche più complesse.

**Non modificare `GiftSection.tsx` senza conferma** (la modifica è solo la riga di import).

---

## FEATURE 14 — Riduzione Costi Firebase

**Fonte:** docx [TBC] "Come ridurre i costi"

**Fase attiva:** infrastruttura (non UI)

### Intervento 1 — Cache offline Firestore

Firebase SDK supporta persistenza IndexedDB. Riduce letture per visite ripetute.

Aggiungere in `App.tsx` subito dopo `export const db = getFirestore(firebaseApp)`:
```typescript
import { enableIndexedDbPersistence } from "firebase/firestore";

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open — persistence can only be enabled in one tab at a time
    console.warn("Firestore persistence: multiple tabs open");
  } else if (err.code === 'unimplemented') {
    // Browser doesn't support persistence
    console.warn("Firestore persistence: not supported by browser");
  }
});
```

### Intervento 2 — Paginazione query admin

In `useAdminData` (usato da `Admin.tsx`), le query leggono tutte le famiglie senza filtro né limite. Con molti invitati, ogni apertura del pannello admin consuma letture proporzionali al totale famiglie.

**Correzione:** Implementare paginazione con `startAfter` + `limit(20)` di Firestore. Aggiungere bottoni "precedente/successivo" in `Admin.tsx`.

### Intervento 3 — Sostituire `onSnapshot` dove non serve real-time

`onSnapshot` mantiene connessione WebSocket attiva = letture continue. Per dati che cambiano raramente:
- `config/bank` → `getDoc` (one-shot) — Feature 9 lo fa già
- `config/photoSharing` → `getDoc` — Feature 4
- `config/playlist` → `getDoc` — Feature 5
- `menu` → `getDocs` — Feature 6
- `guestbook` → `onSnapshot` — corretto, serve real-time

`useFamilyData.ts` è già corretto: usa `getDoc` (one-shot), non `onSnapshot`. Il re-fetch è triggerato dal cambio di `wedding.isWeddingStarted` nella dependency array di `useEffect`, il che è intenzionale (ricarica dati quando cambia la fase temporale).

---

## Bug fix addizionali (scoperti da review completa del codice sorgente)

Questi fix non sono coperti dalle Feature 1–14. Sono bug o problemi emersi dalla lettura completa dei file caricati.

### FIX A — useNeedToRefresh.ts: memory leak + logica timer errata

**Bug 1 (memory leak):** Il cleanup di `useEffect` rimuove una funzione anonima nuova (`() => {}`) anziché `checkIfNeedToRefresh`. Il listener `focus` originale resta registrato per sempre.

**Correzione:**
```typescript
// PRIMA (bug)
return () => {
  window.removeEventListener("focus", () => {});
};

// DOPO (fix)
return () => {
  window.removeEventListener("focus", checkIfNeedToRefresh);
};
```

**Bug 2 (logica timer):** `diff / (1000 * 60 * minutes)` con `minutes=30` produce un valore confrontato con `24`, quindi il refresh scatta dopo `24 * 30 = 720 minuti` (12 ore), non dopo 30 minuti come suggerito dal nome del parametro.

**Correzione:** Decidere l'intento (refresh dopo 30 min o dopo 12 ore) e allineare la formula.

**Non modificare senza conferma.**

---

### FIX B — FamilyRow.tsx e FamilyMembers.tsx: `key` in props type

Entrambi definiscono `key: string` nel tipo props. `key` è una prop riservata React consumata dal reconciler e mai passata al componente. Il campo è morto.

**Correzione:** Rimuovere `key` dal tipo props. Se serve un identificatore, usare un prop con nome diverso (es. `familyKey` o `familyId`).

```typescript
// PRIMA
type FamilyRowProps = {
  familyData: FamilyData;
  key: string;  // ← morto, React non lo passa
};

// DOPO
type FamilyRowProps = {
  familyData: FamilyData;
};
```

Stessa correzione per `FamilyRowsProps` in `FamilyMembers.tsx`.

**Non modificare senza conferma.**

---

### FIX C — constants.ts: `containerWidth` stale su resize

`containerWidth = Math.min(window.innerWidth, 700)` è calcolato a livello di modulo (top-level). Il valore viene fissato al primo import e non si aggiorna mai al resize della finestra.

**Impatto:** Tutti i componenti che dipendono da `containerWidth` e derivati (`containerHalfWidth`, `headerCharacterWidth`, `weddingRingWidth`, `aroundTheWorldAnimationWidth`, `errorAnimationWidth`) usano dimensioni potenzialmente stale dopo un resize. Questo include `AnimatedCharacter.tsx`, `Container` (`container/index.tsx`), `GiftSection.tsx`, `WeddingRings.tsx`.

**Opzioni di correzione:**
- **Minima:** Convertire in hook `useContainerWidth()` che usa `useMediaQuery` o `window.addEventListener('resize')` con debounce
- **Pragmatica:** Mantenere come costante (l'app è pensata per mobile, il resize è raro) ma documentare il vincolo

**Non modificare senza conferma** — impatta molti componenti.

---

### FIX D — useAdmin.ts: catch vuoto in `useAdminData`

`.catch(() => {})` inghiotte silenziosamente errori Firestore. Se il caricamento famiglie fallisce, il pannello admin mostra solo uno stato vuoto senza feedback.

**Correzione:** Aggiungere stato errore e mostrare `ErrorMask` o `Snackbar`.

```typescript
const [error, setError] = useState<string | null>(null);
// ...
.catch((err) => {
  setError("Errore nel caricamento dati");
  console.error(err);
});
```

**Non modificare senza conferma.**

---

### FIX E — useRestaurant.ts: `isPrinting` dead code

`export const isPrinting = false` è esportato ma non usato in modo significativo. Dead code o placeholder mai completato.

**Correzione:** Verificare se è referenziato altrove (`grep -rn "isPrinting" src/`). Se non usato, rimuovere.

**Non modificare senza conferma.**

---

## Riepilogo e priorità suggerite

| # | Feature | Complessità | Dipendenze esterne | Valore | Fonte |
|---|---------|-------------|-------------------|--------|-------|
| A | Fix useNeedToRefresh (leak + timer) | Bassa | Nessuna | Bug fix | Code review |
| B | Fix key prop morta (FamilyRow, FamilyMembers) | Bassa | Nessuna | Pulizia | Code review |
| D | Fix useAdmin catch vuoto | Bassa | Nessuna | Stabilità admin | Code review |
| E | Fix isPrinting dead code | Bassa | Nessuna | Pulizia | Code review |
| 9 | Refactoring Logica Bancaria | Bassa | Nessuna | Architetturale | docx [TBC] |
| 10 | Fix WhatsApp Sicurezza/Errori | Bassa | Nessuna | Sicurezza | docx [TBC] |
| 11 | Fix AddFamily.tsx | Bassa | Nessuna | Stabilità | docx [TBC] |
| 14 | Riduzione Costi Firebase | Bassa | Nessuna | Infra | docx [TBC] |
| C | Valutare containerWidth stale | Bassa-Media | Nessuna | Architetturale | Code review |
| 1 | Guestbook | Bassa | Nessuna | Alto (UX) | WedStack |
| 6 | Anteprima Menù | Bassa | Nessuna | Medio-Alto | WedStack |
| 4 | Google Drive Photo + QR | Bassa | `qrcode.react` | Alto | docx [TBC] |
| 5 | Spotify Playlist | Bassa | `qrcode.react` | Medio | docx [TBC] |
| 2 | i18n Multi-Lingua | Media | `react-i18next` | Alto (se ospiti intl.) | WedStack |
| 13 | Animazione Lottie Korea | Bassa | Lottielab (esterno) | Estetico | docx [TBC] |
| 7 | Carousel Navigation | Media | Nessuna | Medio | WedStack |
| 8 | Sfondi SVG Dinamici | Bassa-Media | Asset SVG da creare | Estetico | WedStack |
| 3 | Dashboard + Grafici + PDF | Media-Alta | `recharts`, `jspdf` | Alto (admin) | michax + docx [TBC] |
| 12 | Automazione Post-RSVP | Alta | Cloud Functions (percorso B/C) | Medio | WedStack |

**Logica dell'ordine:** Bug fix immediati (A, B, D, E) → refactoring architetturali (9, 10, 11, 14, C) → feature nuove a bassa complessità → feature complesse.

---

## Istruzioni per l'agente

1. **Non introdurre librerie non elencate** nello stack vincolante senza giustificazione esplicita. MUI per UI, Jotai per stato, Framer Motion per animazioni, fp-ts per pattern funzionali, immer per immutabilità. Non usare shadcn, Zustand, Redux, Chakra, Tailwind, CSS-in-JS diverso da MUI `sx`/`styled`.
2. **Non modificare file esistenti senza istruzione esplicita.** Ogni feature elenca chiaramente quali file richiedono modifica e quali sono da creare. Documentare le modifiche necessarie e attendere conferma. Questo vale in particolare per: `App.tsx`, `SectionContainer.tsx`, `GiftSection.tsx`, `WhatsAppWidget.tsx`, `AddFamily.tsx`, `constants.ts`, `family.ts`.
3. **Tutti i colori, spacing, typography dal theme** in `src/theme.ts`. Zero valori hardcoded. Nota: `GiftSection.tsx` e `WhatsAppWidget.tsx` attualmente hanno colori hardcoded (`#87f395aa`, `#14c4e1`, `#44b700`, `rgba(252,252,252,0.8)`) — non replicare questo anti-pattern nei nuovi componenti.
4. **Gestire errori con fp-ts.** `Option<T>` per nullable, `Either<Error, T>` per fallibili, `TaskEither` per operazioni async Firebase.
5. **Ogni nuova sezione deve avere animazione di ingresso** con Framer Motion, coerente con il pattern esistente (`motion.div` con `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}`).
6. **Per ogni nuova collection Firestore**, specificare regole di sicurezza (chi legge, chi scrive, chi cancella).
7. **Ogni nuovo hook deve avere almeno un test unitario.** Pattern di riferimento: `src/App.test.tsx`.
8. **Dichiarare la fase temporale** in cui la feature è attiva (`isWeddingStarted`, `isPartyStarted`, `isWeddingOver`) e come si integra con la logica condizionale di rendering in `App.tsx`.
9. **Asset statici serviti come URL** (immagini, SVG di sfondo) vanno in `public/`. Asset importati nel codice TypeScript vanno in `src/images/` o `src/animation/`.
10. **Nessuna operazione di modifica/cancellazione** su Firestore deve essere esposta all'utente finale. Solo l'admin può cancellare/modificare dati (guestbook, famiglie, menù). L'utente finale può solo leggere e scrivere (creare messaggi, confermare RSVP).
