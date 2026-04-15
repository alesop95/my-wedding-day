# SKILL.md — Code Refactor

## Trigger

Attivare questa skill quando l'utente chiede: refactor, pulisci, ottimizza, rimuovi duplicazioni, migliora un componente.

## Protocollo

### Step 1 — Analisi (OBBLIGATORIO prima di qualsiasi modifica)
1. Leggere l'intero file target
2. Produrre un report strutturato:
   - **Responsabilità** del componente (cosa fa)
   - **Stato** gestito (useState, useAtom, props)
   - **Side effects** (useEffect, Firebase, DOM)
   - **Dipendenze** (import da altri moduli del progetto)
   - **Criticità** identificate (duplicazioni, mutazioni, key instabili, colori hardcoded)

### Step 2 — Proposta
Presentare la proposta di refactoring come lista di modifiche:
- Cosa cambia
- Perché cambia
- Cosa NON cambia (funzionalità preservate)
- Rischi e impatti su altri file

### Step 3 — Esecuzione (solo dopo conferma)
Applicare le modifiche. Per ogni file modificato:
- Mostrare diff chiaro (prima/dopo)
- Verificare che i tipi TypeScript compilino: `npx tsc --noEmit`

### Step 4 — Checklist post-modifica
```
### ✅ Checklist delle modifiche
- [ ] Funzionalità preservata
- [ ] Zero `any` introdotti
- [ ] Zero colori hardcoded aggiunti
- [ ] Key stabili (no index)
- [ ] Immutabilità rispettata (immer dove necessario)
- [ ] useEffect con cleanup dove serve
- [ ] Import ordinati
- [ ] tsc --noEmit passa
```

## Refactoring comuni per questo progetto

| Pattern problematico | Correzione |
|---|---|
| Colori hex in `sx={{ color: "#xxx" }}` | `sx={{ color: theme.palette.xxx }}` o `useTheme()` |
| `window.open(url)` | `window.open(url, '_blank', 'noopener,noreferrer')` |
| `members[index].field = value` | `produce(members, draft => { draft[index].field = value })` |
| `key={index}` in lista dinamica | `key={item.id}` o `key={item.firstName + "_" + item.lastName}` |
| Stato duplicato locale + remoto | Singola fonte di verità, derivare con trasformazioni |
| `onSnapshot` per dati statici | `getDoc` one-shot |
