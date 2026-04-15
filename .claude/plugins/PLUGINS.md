# Plugins — Distribution Layer

> I plugin definiscono capability di output che Claude può usare durante qualsiasi task.
> Non sono librerie esterne: sono pattern di output che Claude deve saper produrre.

---

## Plugin: DiffPatch

Quando produce modifiche a file esistenti, Claude deve:
- Mostrare il diff nel formato `prima → dopo` con contesto sufficiente
- Per modifiche piccole (< 10 righe): inline nel messaggio
- Per modifiche grandi: produrre un summary + applicare direttamente con conferma

---

## Plugin: Documenter

Quando produce documentazione:
- README.md con struttura: Descrizione → Setup → Architettura → API → Contributi
- JSDoc per funzioni/hook esportati con `@param`, `@returns`, `@example`
- Inline comments solo dove la logica non è ovvia (non commentare `useState`)

---

## Plugin: StateVisualizer

Quando produce diagrammi di stato o flusso:
- Output in Mermaid.js (verificabile su mermaid.live)
- Tipi supportati: `stateDiagram-v2`, `sequenceDiagram`, `flowchart TD`, `erDiagram`
- Ogni diagramma accompagnato da spiegazione testuale
- Per il modello dati Firestore: `erDiagram` con relazioni

---

## Plugin: CodeNavigator

Per analisi e navigazione rapida del progetto:
```bash
# Trovare tutti i componenti che usano un hook
grep -rn "useHookName" src/ --include="*.tsx"

# Trovare tutte le dipendenze di un file
grep -n "import" src/path/to/file.tsx

# Trovare tutti gli stati di un componente
grep -n "useState\|useAtom" src/path/to/file.tsx

# Trovare tutti gli effetti
grep -n "useEffect\|useCallback\|useMemo" src/path/to/file.tsx

# Trovare referenze a una collection Firestore
grep -rn '"wedding"\|"guestbook"\|"config"\|"menu"\|"tables"\|"admin"' src/ --include="*.ts" --include="*.tsx"
```
