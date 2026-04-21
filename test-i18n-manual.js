// Test manuale per Feature 2 - Internazionalizzazione
// Da eseguire nella console del browser su http://localhost:3000

console.log("🧪 INIZIO TEST FEATURE 2 - INTERNAZIONALIZZAZIONE\n");

// Test 1: Verifica LanguageSwitcher nell'header
console.log("📋 TEST 1: LanguageSwitcher nell'header");
const languageSwitcher = document.querySelector('[aria-label="language selector"]');
console.log("✅ LanguageSwitcher trovato:", languageSwitcher !== null);

// Test 2: Verifica toggle IT ↔ EN
console.log("\n📋 TEST 2: Toggle lingue IT ↔ EN");
const itButton = document.querySelector('[aria-label="italiano"]');
const enButton = document.querySelector('[aria-label="english"]');
console.log("✅ Bottone IT trovato:", itButton !== null);
console.log("✅ Bottone EN trovato:", enButton !== null);

// Test 3: Verifica testi specifici tradotti
console.log("\n📋 TEST 3: Verifica testi tradotti");
const tests = [
  { selector: 'h1', expected_it: 'Alessio & Beatrice', expected_en: 'Alessio & Beatrice' },
  { selector: 'h2', expected_it: 'sposi', expected_en: 'getting married' }
];

tests.forEach((test, index) => {
  const element = document.querySelector(test.selector);
  if (element) {
    console.log(`✅ Elemento ${test.selector} trovato:`, element.textContent.trim());
  } else {
    console.log(`❌ Elemento ${test.selector} non trovato`);
  }
});

// Test 4: Simula cambio lingua e verifica
console.log("\n📋 TEST 4: Simulazione cambio lingua");
console.log("💡 ISTRUZIONI MANUALI:");
console.log("1. Clicca il bottone EN in alto a destra");
console.log("2. Verifica che i testi cambino da italiano a inglese");
console.log("3. Clicca il bottone IT per tornare all'italiano");
console.log("4. Ricarica la pagina e verifica che la lingua sia persistita");

// Test 5: Verifica sezioni specifiche
console.log("\n📋 TEST 5: Verifica sezioni tradotte");
const sections = [
  "WeAreWedding (header principale)",
  "AtHome (pre-cerimonia)",
  "WhereSection (cerimonia e ricevimento)",
  "GiftSection (lista nozze)",
  "HotelSection (alloggi)",
  "GallerySection (foto)",
  "RSVPSection (conferma presenza)",
  "GuestbookSection (messaggi)"
];

sections.forEach(section => {
  console.log(`📝 Testare manualmente: ${section}`);
});

// Test 6: Test funzioni WhatsApp (solo log delle funzioni)
console.log("\n📋 TEST 6: Funzioni WhatsApp i18n");
console.log("💡 Le funzioni getWhatsAppMessageI18n sono state implementate");
console.log("💡 Testare nel pannello admin per verificare i messaggi generati");

console.log("\n🎯 RISULTATO ATTESO:");
console.log("✅ Toggle IT/EN cambia tutti i testi immediatamente");
console.log("✅ Tutti i componenti mostrano traduzioni corrette");
console.log("✅ La lingua scelta persiste dopo refresh");
console.log("✅ Zero testi hardcoded visibili");

console.log("\n🚀 Completare i test manuali seguendo le istruzioni sopra!");