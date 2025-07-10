// src/hooks/useFirestoreCollection.js
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

export function useFirestoreCollection(path, filters = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // build a query with optional constraints
    const collectionRef = collection(db, path);
    const q = filters.length
      ? query(collectionRef, ...filters)
      : collectionRef;

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(items);
        setLoading(false);
      },
      (error) => {
        console.error('useFirestoreCollection error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path, JSON.stringify(filters)]);

  return { data, loading };
}