import { useState, useCallback, useRef } from 'react';

// Tipo para las burbujas simplificado
export interface Bubble {
  id: number;
  x: number;
  y: number;
}

export const useBubbles = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const counterRef = useRef(0); // Usar ref para mantener el contador sin causar re-renders

  // Función para crear una nueva burbuja con ID completamente único
  const createBubble = useCallback((x: number, y: number) => {
    // Incrementar el contador y usar timestamp + contador para garantizar unicidad
    counterRef.current += 1;
    const uniqueId = Date.now() * 1000 + counterRef.current; // Multiplicar por 1000 para evitar colisiones
    
    const newBubble: Bubble = {
      id: uniqueId,
      x: x - 20, // Centrar la burbuja
      y: y - 20,
    };
    
    setBubbles(prev => [...prev, newBubble]);
  }, []);

  // Función para eliminar una burbuja
  const removeBubble = useCallback((id: number) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== id));
  }, []);

  // Función para limpiar todas las burbujas
  const clearBubbles = useCallback(() => {
    setBubbles([]);
    counterRef.current = 0; // Resetear el contador
  }, []);

  return {
    bubbles,
    createBubble,
    removeBubble,
    clearBubbles,
  };
};