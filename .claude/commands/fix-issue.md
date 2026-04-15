# /project:fix-issue

Risolvi un problema specifico in un file, seguendo il protocollo di refactoring sicuro.

## Input
Descrizione del problema e file coinvolto.

## Protocollo

1. **Leggi l'intero file** — non operare su frammenti
2. **Identifica la causa root** — non il sintomo
3. **Verifica impatti** — quali altri file importano o usano il componente/funzione?
   ```bash
   grep -r "import.*NomeComponente" src/
   grep -r "NomeComponente" src/ --include="*.tsx" --include="*.ts"
   ```
4. **Proponi la fix** con diff chiaro (prima/dopo)
5. **Attendi conferma** prima di applicare (specialmente per file critici)
6. **Applica la fix**
7. **Verifica compilazione**: `npx tsc --noEmit`
8. **Genera checklist**:
   ```
   ### ✅ Fix applicata
   - File: ...
   - Problema: ...
   - Soluzione: ...
   - File impattati: ...
   - [ ] tsc --noEmit passa
   - [ ] Funzionalità preservata
   ```
