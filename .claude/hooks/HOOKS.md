# HOOKS.md — Guardrail Layer

##  PreRequest Hooks
- “Verifica sempre se esiste già una funzione/hook prima di crearne una nuova.”
- “Prima di modificare un componente, leggi tutto il file e descrivi la logica attuale.”

##  PostRequest Hooks
- “Alla fine di ogni modifica codice, genera automaticamente una sezione:  
  `###  Checklist delle modifiche`”

##  SessionStart Hook
Quando apro il progetto:
“Ricordami lo stato attuale dell’applicazione, i problemi noti e i file chiave.”

##  SubStep Hook
Quando chiedo modifiche profonde:
- Dividere sempre in micro-step:
  1. Analisi file
  2. Identificazione criticità
  3. Proposta architetturale
  4. Patch finale