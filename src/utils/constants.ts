// Responsive dimensions moved to useResponsiveDimensions hook
export const easterEggActivationClicks = 5;

// ============================================================================
// Wedding Dates — Single Source of Truth
// ============================================================================
// Tutte le date del matrimonio sono centralizzate qui per evitare duplicazione.
// NON hardcodare `new Date(2027, ...)` altrove nel codice.

/** Inizio del matrimonio: 24 Luglio 2027, 00:00 */
export const weddingDate = new Date(2027, 6, 24);

/** Inizio della festa/ricevimento: 24 Luglio 2027, 19:30 */
export const partyStartDate = new Date(2027, 6, 24, 19, 30);

/**
 * Fine del matrimonio con grace period: 25 Luglio 2027, 00:30.
 * Il grace period di 30 minuti dopo mezzanotte evita race condition
 * e perdita di stati non persistiti durante la transizione.
 */
export const weddingEndDate = new Date(2027, 6, 25, 0, 30);

export const confirmDaysBefore = 45;
export const bank = {
  iban: "IT52W0306968873100000018352",
  owner: "Alessio Sopranzi",
  bicSwift: "BCITITMM",
  // number: ""
  //bankName: "Intesa San Paolo",
  //ABI: "03069",
  // Il CIN corrisponde al quinto carattere dell'IBAN, mentre il CAB è composto dai 5 numeri successivi all'ABI 
};
export const tripDescription1 = `La vostra presenza sarà per noi il dono più bello e non chiediamo di più di ciò che abbiamo.`;
export const tripDescription2 = `Se si vuole si può contribuire per rendere indimenticabile la nostra luna di miele, amiamo viaggiare e conoscere nuovi luoghi e persone.`;
export const animationCharacterConfig = {
  animationDuration1: 1,
  animationDelay1: 0,
  easeAnimation1: "easeOut",
  animationDuration2: 0.5,
  animationDelay2: 2.0,
  easeAnimation2: "easeIn"
};

export const animationRingConfig = {
  delay: 1.8,
  duration: 1,
  type: "spring",
  bounce: 0.45
};
