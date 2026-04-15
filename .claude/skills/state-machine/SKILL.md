# SKILL.md — State Machine & Diagrams

## Trigger

Attivare quando l'utente chiede: diagramma di stato, flusso, analisi stati, state machine, mermaid, sequenza.

## Protocollo

### Analisi stato applicazione
1. Identificare tutti gli stati (Jotai atoms + useState + condizioni in App.tsx)
2. Identificare le transizioni (eventi utente, timer, Firebase update)
3. Produrre diagramma Mermaid

### Diagramma principale dell'app

```mermaid
stateDiagram-v2
    [*] --> Loading: App mount
    Loading --> Error: result.kind === error
    Loading --> Admin: useAdmin() === true
    Loading --> Restaurant: useRestaurant() === true
    Loading --> WeddingOver: isWeddingOver === true
    Loading --> MainApp: result + elapsed

    state MainApp {
        [*] --> HeaderAnimation
        HeaderAnimation --> SectionsVisible: onAnimationComplete
        
        state SectionsVisible {
            WeAreWedding --> PreWedding: !isWeddingStarted
            WeAreWedding --> PartyMode: isPartyStarted
            
            state PreWedding {
                AtHome
                WhereSection
                RSVPSection
                HotelSection
                GiftSection
                GallerySection
            }
            
            state PartyMode {
                GallerySection_Top
                WhereSection_Party
                GiftSection_Party
            }
        }
    }
```

### Diagramma RSVP flow

```mermaid
sequenceDiagram
    participant U as Ospite
    participant R as RSVPSection
    participant F as Firestore
    participant A as Admin

    U->>R: Apre URL /{familyId}
    R->>F: useFamilyData(familyId)
    F-->>R: FamilyData + members
    R->>U: Mostra form conferma per ogni membro
    U->>R: Toggle rsvp yes/no per ogni membro
    R->>R: produce(immer) → updatedFamilyData
    U->>R: Conferma
    R->>F: useUpdateFamilyData → updateDoc
    F-->>R: success
    R->>U: ConfettiExplosion 🎉
    A->>F: Report.tsx → getDocs(wedding)
    F-->>A: Aggregazione confermati/rifiutati
```

### Output richiesto

Quando si genera un diagramma:
1. Produrre codice Mermaid valido (testabile su mermaid.live)
2. Spiegare ogni stato e transizione
3. Identificare edge case o stati non gestiti
