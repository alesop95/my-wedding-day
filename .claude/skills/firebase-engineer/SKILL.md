# SKILL.md — Firebase Engineer

## Trigger

Attivare quando l'utente chiede: query Firestore, regole di sicurezza, ottimizzare letture, batch update, nuova collection, migrare dati.

## Protocollo

### Per nuova collection
1. Definire schema TypeScript in `src/types/`
2. Definire regole di sicurezza (chi legge, chi scrive, chi cancella)
3. Creare hook in `src/hooks/` con pattern `getDoc` (statico) o `onSnapshot` (real-time)
4. Gestire errori con `fp-ts Either/TaskEither`
5. Gestire cleanup in `useEffect` return per `onSnapshot`

### Per ottimizzazione
1. Identificare tutti i punti di lettura Firestore nel progetto (grep `onSnapshot`, `getDoc`, `getDocs`)
2. Classificare: necessita real-time? → `onSnapshot`. Altrimenti → `getDoc`
3. Verificare che ogni `onSnapshot` abbia cleanup
4. Proporre paginazione dove collection può crescere (> 50 documenti)

### Per regole di sicurezza
- Consultare `.claude/rules/firebase-conventions.md` per il template
- Mai permettere `write: if true` su collection con dati sensibili
- Il pattern di autenticazione del progetto è anonimo (Firebase Anonymous Auth) con familyId come credenziale

## Hook template

```typescript
// Pattern one-shot (config, menu, dati statici)
export const useConfigData = <T>(docPath: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, ...docPath.split("/")));
      if (snap.exists()) setData(snap.data() as T);
      setLoading(false);
    };
    fetch();
  }, [docPath]);

  return { data, loading };
};
```

```typescript
// Pattern real-time (guestbook, dati che cambiano)
export const useRealtimeCollection = <T>(collectionPath: string) => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, collectionPath), orderBy("createdAt", "desc")),
      (snapshot) => {
        setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T)));
        setLoading(false);
      }
    );
    return () => unsub(); // CRITICO: cleanup
  }, [collectionPath]);

  return { items, loading };
};
```
