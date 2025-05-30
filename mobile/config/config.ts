import { useEffect, useState, useCallback } from 'react';

export const petId = '3d1876de-7066-4ef7-b1e4-dbd4ec617601';
export const userId = '330fec02-1b89-4242-82ce-adb6a0ee3aff';
export const API_URL = 'http://192.168.1.155:8080';
export const energyPerHour = 10;

export function useFetch<T = any>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores previos

      const url = `${API_URL}${endpoint}`; // ✅ ya está completo
      console.log('[useFetch] GET', url);

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Función refetch para volver a hacer la petición manualmente
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}