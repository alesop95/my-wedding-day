# CLAUDE.md — Memory Layer

##  Architecture Rules
- Il progetto è una SPA React 18 + TypeScript.
- Usa: Material-UI, Jotai, Firebase (Auth anonima + Firestore), Framer Motion, Lottie.
- Routing via parsing pathname, NON React Router.
- Ogni famiglia accede tramite URL come credenziale (ID nel path).
- /admin e /restaurant usano password via query param e verificano su Firestore.
- Stato globale con Jotai, nessun redux.
- Le modifiche più critiche: AddFamily.tsx, FamilyRow.tsx, Hooks Firebase.

##  Naming Conventions
- File React: PascalCase.tsx
- Hooks: useSomething.ts
- Types: camelCase oppure PascalCase se oggetti complessi
- Atomi Jotai: somethingAtom.ts
- Firestore docs: lower_snake_case

##  Project Directives
- Massima immutabilità negli update (preferire immer).
- Evitare duplicazione stato (es. members + familyData → unificare).
- Evitare key basate su index.
- Prompt preferiti per Claude: refactor, explain, optimize, add feature.

##  Context Persistence
Claude deve ricordare:
- struttura progetto
- logica routing
- logica RSVP
- animazioni Lottie
- stato wedding (date, countdown, over)
- criticità architetturali già note
