# Testing Rules

## Framework

- Test runner: Jest (incluso con CRA)
- Testing library: `@testing-library/react` (già configurato in `setupTests.ts`)
- Pattern di riferimento: `src/App.test.tsx`

## Cosa testare

### Hook custom (priorità alta)
- Ogni nuovo hook in `src/hooks/` deve avere un test in `src/hooks/__tests__/useHookName.test.ts`
- Testare: stato iniziale, stato dopo fetch, gestione errori, cleanup
- Mock Firebase con `jest.mock("firebase/firestore")`

### Utility functions (priorità alta)
- Ogni funzione in `src/utils/` deve avere test puri (input → output)
- File test: `src/utils/__tests__/nomeFile.test.ts`

### Componenti (priorità media)
- Testare rendering condizionale, non styling
- Testare interazioni utente (click, submit) con `fireEvent` o `userEvent`
- Non testare implementazione interna (no snapshot test su componenti MUI complessi)

## Cosa NON testare

- Componenti puramente dichiarativi senza logica (es. `AtHome.tsx`, `WeddingIsOver.tsx`)
- Styling MUI
- Animazioni Framer Motion / Lottie

## Pattern mock Firebase

```typescript
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  where: jest.fn(),
}));
```

## Esecuzione

```bash
yarn test                    # tutti i test
yarn test --watchAll=false   # CI mode
yarn test --coverage         # con report copertura
```
