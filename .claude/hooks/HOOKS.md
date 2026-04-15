# Hooks — Guardrail Layer

> Queste regole si applicano automaticamente ad ogni interazione. Non sono comandi espliciti ma vincoli comportamentali.

---

## PreRequest Hooks (PRIMA di ogni azione)

### Hook: Verifica esistenza
Prima di creare un nuovo hook, componente, tipo o utility:
```bash
grep -rn "NomeProposto\|nomeProposto" src/ --include="*.ts" --include="*.tsx"
```
Se esiste già qualcosa con nome o scopo simile, segnalarlo e proporre riuso o estensione anziché duplicazione.

### Hook: Lettura completa
Prima di modificare qualsiasi file:
1. Leggere l'intero contenuto del file (non frammenti)
2. Identificare tutte le dipendenze interne (`grep -rn "import.*NomeFile" src/`)
3. Descrivere in una frase cosa fa il componente/hook/utility attualmente

### Hook: File protetti
I seguenti file richiedono conferma esplicita prima di qualsiasi modifica:
- `App.tsx`
- `SectionContainer.tsx`
- `GiftSection.tsx`
- `WhatsAppWidget.tsx`
- `AddFamily.tsx`
- `FamilyRow.tsx`
- `constants.ts`
- `src/types/family.ts`
- `index.tsx`
- `theme.ts`

Se una modifica richiede toccare uno di questi file, fermarsi e presentare:
- Cosa si vuole modificare
- Perché
- Diff previsto
- Impatto su altri file

Procedere solo dopo conferma.

---

## PostRequest Hooks (DOPO ogni azione)

### Hook: Checklist modifiche
Alla fine di ogni modifica codice, generare automaticamente:
```
### ✅ Checklist delle modifiche
- File: [lista file toccati]
- Tipo: [creazione | modifica | refactoring | fix]
- [ ] tsc --noEmit passa
- [ ] Zero `any` introdotti
- [ ] Colori dal theme (zero hardcoded)
- [ ] Key stabili (no index)
- [ ] useEffect con cleanup dove serve
- [ ] Coerente con naming conventions
```

### Hook: Impatto dichiarato
Se la modifica potrebbe impattare altri file o comportamenti:
```
### ⚠️ Impatti potenziali
- [file]: [descrizione impatto]
```

---

## SessionStart Hook

Quando si apre il progetto per la prima volta in una sessione:

> "Riassumi lo stato attuale del progetto:
> 1. Ultimo file modificato (se noto)
> 2. Feature del backlog in corso (se nota)
> 3. Criticità architetturali aperte (da CLAUDE.md)
> 4. File chiave da tenere a mente"

---

## DeepChange Hook

Quando viene richiesta una modifica profonda (refactoring strutturale, cambio architettura, migrazione dati):

Dividere obbligatoriamente in micro-step sequenziali:
1. **Analisi** — leggere tutti i file coinvolti, descrivere stato attuale
2. **Identificazione criticità** — elencare cosa non funziona e perché
3. **Proposta architetturale** — descrivere la soluzione con diff previsti
4. **Conferma** — attendere approvazione esplicita
5. **Esecuzione** — applicare le modifiche un file alla volta
6. **Verifica** — `npx tsc --noEmit` + checklist

Mai saltare dallo step 1 allo step 5.
