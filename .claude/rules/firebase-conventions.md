# Firebase Conventions

## Firestore

### Collections esistenti
| Collection | Documenti | Accesso |
|---|---|---|
| `wedding` | Un doc per famiglia, id = familyId (usato come path URL) | R: per familyId. W: utente autenticato |
| `admin` | Configurazione admin + password | R: solo verifica password |
| `tables` | Configurazione tavoli ristorante | R/W: admin ristorante |

### Collections nuove (da feature backlog)
| Collection | Scopo | Tipo accesso consigliato |
|---|---|---|
| `config/bank` | Dati bancari IBAN | R: pubblico. W: solo admin console |
| `config/photoSharing` | URL Google Drive foto | R: pubblico. W: solo admin console |
| `config/playlist` | URL Spotify playlist | R: pubblico. W: solo admin console |
| `config/contacts` | Contatti WhatsApp | R: pubblico. W: solo admin console |
| `guestbook` | Messaggi ospiti | R: pubblico. W: utenti autenticati. D: solo admin |
| `menu` | Piatti del menù | R: pubblico. W: solo admin |

### Pattern di lettura

**One-shot (dati statici/config):**
```typescript
import { doc, getDoc } from "firebase/firestore";
const snap = await getDoc(doc(db, "collection", "docId"));
if (snap.exists()) { /* ... */ }
```
Usare per: `config/*`, `menu`, dati che non cambiano durante la sessione.

**Real-time (dati che cambiano):**
```typescript
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
const unsub = onSnapshot(
  query(collection(db, "guestbook"), orderBy("createdAt", "desc")),
  (snapshot) => { /* ... */ }
);
// CRITICO: cleanup in useEffect return
return () => unsub();
```
Usare per: `guestbook`, RSVP durante conferma attiva.

### Pattern di scrittura

```typescript
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
await addDoc(collection(db, "guestbook"), {
  ...data,
  createdAt: serverTimestamp() // mai Date.now() o new Date()
});
```

### Regole di sicurezza (template)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Famiglie: lettura solo il proprio doc
    match /wedding/{familyId} {
      allow read: if request.auth != null;
      allow update: if request.auth != null;
    }
    // Guestbook: tutti leggono, autenticati scrivono, nessuno cancella da client
    match /guestbook/{messageId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.resource.data.message.size() <= 500;
      allow delete: if false; // solo da admin console o Cloud Function
    }
    // Config: solo lettura
    match /config/{docId} {
      allow read: if true;
      allow write: if false;
    }
    // Menu: solo lettura
    match /menu/{itemId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### Ottimizzazione costi

1. Preferire `getDoc` a `onSnapshot` dove non serve real-time
2. Abilitare persistenza IndexedDB: `enableIndexedDbPersistence(db)`
3. Paginare query admin: `query(collection(db, "wedding"), limit(20), startAfter(lastDoc))`
4. Mai query senza filtro o limite su collection grandi
