# /project:add-feature

Implementa una nuova feature dal backlog in `CLAUDE_WEDDING_FEATURES.md`.

## Input
Numero o nome della feature (es. "Feature 1 — Guestbook" o "Feature 9 — Bank refactoring").

## Protocollo

1. **Leggi la specifica** della feature in `CLAUDE_WEDDING_FEATURES.md`
2. **Verifica prerequisiti**: la feature dipende da altre feature non ancora implementate?
3. **Elenca tutti i file da creare** (tipi, hook, componente, test)
4. **Elenca tutti i file esistenti da modificare** (con diff previsto)
5. **Attendi conferma** per le modifiche a file esistenti
6. **Implementa in ordine**:
   a. Tipo in `src/types/`
   b. Hook in `src/hooks/`
   c. Componente in `src/sections/` o `src/common/`
   d. Test in `__tests__/`
   e. (Se admin) Componente admin in `src/admin/`
7. **Verifica**: `npx tsc --noEmit`
8. **Genera report**:
   ```
   ### ✅ Feature implementata: [nome]
   - File creati: ...
   - File modificati: ...
   - Collection Firestore nuove: ...
   - Regole sicurezza da aggiungere: ...
   - Pacchetti npm da installare: ...
   - Posizionamento in App.tsx: ...
   - Fase temporale attiva: ...
   - [ ] tsc --noEmit passa
   - [ ] Coerente con theme
   - [ ] Animazione ingresso Framer Motion
   - [ ] Accessibilità base
   ```
