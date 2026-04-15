# /project:review

Analizza il file o componente specificato e produci un report strutturato.

## Input
Il path del file da analizzare (es. `src/sections/GiftSection.tsx`)

## Output atteso

### 1. Responsabilità
Cosa fa il componente, in una frase.

### 2. Dipendenze
Lista di import interni al progetto (hook, tipi, componenti, utils).

### 3. Stato
Tutti i `useState`, `useAtom`, props ricevute.

### 4. Side effects
Tutti i `useEffect`, `setInterval`, `setTimeout`, chiamate Firebase.

### 5. Criticità
Lista numerata di problemi trovati, classificati per gravità:
- 🔴 Critico (bug, sicurezza, data loss)
- 🟡 Importante (performance, manutenibilità, duplicazione)
- 🟢 Minore (stile, naming, accessibilità)

### 6. Suggerimenti
Azioni concrete per risolvere ogni criticità, con riferimento al file/riga.
