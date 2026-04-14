export const containerWidth = Math.min(window.innerWidth, 700);
export const containerHalfWidth = containerWidth / 2;
export const headerCharacterWidth = containerHalfWidth * 0.5;
export const weddingRingWidth = headerCharacterWidth * 0.5;
export const sectionHeaderIconWidth = Math.min(headerCharacterWidth * 0.3, 48);
export const errorAnimationWidth = containerWidth * 0.6;
export const aroundTheWorldAnimationWidth = containerWidth * 0.3;
export const easterEggActivationClicks = 5;
export const weddingDate = new Date(2027, 6, 24);
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
