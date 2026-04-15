# SKILL.md — UI/UX Polish

## Trigger

Attivare quando l'utente chiede: migliorare UI, rendere responsive, accessibilità, ARIA, PWA, layout.

## Protocollo

### Responsive
- Verificare ogni componente con `useMediaQuery(theme.breakpoints.down('sm'))`
- `Stack direction` deve adattarsi: `direction={isMobile ? "column" : "row"}`
- Immagini e animazioni: larghezza massima `100%` su mobile
- Touch target minimi: 44x44px per bottoni e aree cliccabili

### Accessibilità
- Elementi cliccabili non-button: `role="button"`, `tabIndex={0}`, `onKeyDown` per Enter/Space
- Immagini: sempre `alt` descrittivo
- Form: `<label>` associato o `aria-label` su ogni input
- Colori: contrasto minimo 4.5:1 (verificare con theme)
- Animazioni: rispettare `prefers-reduced-motion` con Framer Motion `useReducedMotion()`

### MUI best practices per questo progetto
- `Typography` con `variant` dal theme, mai `fontSize`/`fontWeight` inline (eccezione: font Gwendolyn in WeddingIsOver)
- `Button variant="contained"` con `color` dal theme, mai `sx={{ backgroundColor: "#hex" }}`
- `Grid` per layout a griglia, `Stack` per layout lineari
- `Paper`/`Card` per contenitori con elevazione

### Animazioni
- Ingresso sezione: `motion.div` con `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}`
- Liste: `AnimatePresence` + stagger con `variants`
- Transizioni condizionali: `AnimatePresence` con `mode="wait"`
- Lottie: `autoplay` + `loop` per decorative, `lottieRef.current.play()` per triggered
