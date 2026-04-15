# /project:analyze-state

Genera il diagramma degli stati completo dell'applicazione nello stato attuale.

## Protocollo

1. **Scansiona** tutti i file per identificare:
   ```bash
   grep -rn "useState\|useAtom\|atom(" src/ --include="*.ts" --include="*.tsx"
   grep -rn "useEffect\|onSnapshot\|setInterval" src/ --include="*.ts" --include="*.tsx"
   ```
2. **Mappa** ogni stato al componente che lo possiede
3. **Identifica** le transizioni (eventi utente, timer, Firebase callback)
4. **Genera** diagramma Mermaid completo (consultare `.claude/skills/state-machine/SKILL.md`)
5. **Identifica** stati orfani (definiti ma non usati) e transizioni non gestite
6. **Output**: codice Mermaid + spiegazione testuale + lista anomalie
