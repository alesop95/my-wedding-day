# Code Style Rules

## TypeScript

- Strict mode attivo (`strict: true` in tsconfig.json)
- Nessun `any` — usare `unknown` + type guard o generics
- Preferire `type` a `interface` per coerenza con il progetto esistente (il progetto usa `type` ovunque)
- Union types per stati finiti: `rsvp: "yes" | "no" | "maybe" | "unknown"`, mai `string`
- Campi opzionali con `?`, mai `| undefined` esplicito

## React

- Solo componenti funzionali con `React.FC<Props>` (coerente con il progetto)
- Hook custom per ogni logica riutilizzabile — nessuna logica di business inline nei componenti
- `useCallback` per funzioni passate come props a componenti figli
- `useMemo` solo quando il calcolo è effettivamente costoso, non preventivamente
- Zero `useEffect` con dipendenze mancanti o soppresse con `// eslint-disable`
- Props destructuring nel parametro della funzione, non nel corpo

## Immutabilità

- Usare `immer` (produce) per update di oggetti/array complessi — già presente nel progetto
- Mai mutare state direttamente: `state.field = x` è vietato
- Spread operator per oggetti semplici, `immer` per strutture annidate

## MUI

- Ogni componente MUI usa `sx` prop per styling — coerente con theme-styling
- Colori: `theme.palette.*`, mai valori hex/rgb hardcoded
- Spacing: `theme.spacing()`, mai numeri px diretti
- Typography: `variant` prop, mai font-size/weight diretti
- Responsive: `useMediaQuery(theme.breakpoints.down('sm'))` o `sx={{ display: { xs: 'none', md: 'block' } }}`

### Palette reale del theme (`src/theme.ts`)

```
mode:       light
font:       Dosis (con responsiveFontSizes applicato via fp-ts pipe)
primary:    #3f51b5 (indigo)     → theme.palette.primary.main
secondary:  #f50057 (pink)       → theme.palette.secondary.main
divider:    #d5d5d577            → theme.palette.divider
```

Per success/error/warning/info: MUI default (`#2e7d32`, `#d32f2f`, `#ed6c02`, `#0288d1`).

Quando serve un colore non nella palette, estendere il theme in `src/theme.ts` — non hardcodare nel componente.

## Import

- Ordine: React → librerie esterne → componenti interni → hooks → types → utils → assets
- Import nominati (no default export tranne `App.tsx`)
- Path relativi (no alias configurati nel progetto)

## Naming

- Boolean: prefisso `is`, `has`, `should`, `can` (es. `isWeddingOver`, `hasConfirmed`)
- Handler: prefisso `handle` (es. `handleOnClick`, `handleSubmit`)
- Callback props: prefisso `on` (es. `onAnimationComplete`, `onMemberUpdate`)
