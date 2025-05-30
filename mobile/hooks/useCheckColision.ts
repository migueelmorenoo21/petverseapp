import { useRef } from 'react';
import { View } from 'react-native';

interface UseCheckCollisionProps {
  createBubble: (x: number, y: number) => void;
  bubbleCooldown?: number;
}

interface UseCheckCollisionReturn {
  petRef: React.RefObject<View | null>;
  soapRef: React.RefObject<View | null>;
  petContainerRef: React.RefObject<View | null>;
  checkCollision: () => void;
}

export const useCheckCollision = ({
  createBubble,
  bubbleCooldown = 500
}: UseCheckCollisionProps): UseCheckCollisionReturn => {
  // Referencias para detectar colisiones
  const petRef = useRef<View>(null);
  const soapRef = useRef<View>(null);
  const petContainerRef = useRef<View>(null);
  
  // Control de tiempo para limitar creación de burbujas
  const lastBubbleTime = useRef<number>(0);

  // Función para detectar colisión SOLO entre el jabón y la mascota
  const checkCollision = () => {
    if (!petRef.current || !soapRef.current || !petContainerRef.current) return;
    
    // Solo verificar colisión entre jabón y mascota (no las burbujas)
    petRef.current.measure((px, py, pw, ph, pPageX, pPageY) => {
      soapRef.current?.measure((sx, sy, sw, sh, sPageX, sPageY) => {
        // Calcula si hay superposición entre el jabón y la mascota
        const isOverlapping = 
          sPageX < pPageX + pw &&
          sPageX + sw > pPageX &&
          sPageY < pPageY + ph &&
          sPageY + sh > pPageY;
          
        if (isOverlapping) {
          // Control de tiempo: solo crear burbujas cada X milisegundos
          const currentTime = Date.now();
          if (currentTime - lastBubbleTime.current >= bubbleCooldown) {
            lastBubbleTime.current = currentTime; // Actualizar el tiempo de la última burbuja
            
            // Obtener las coordenadas relativas al contenedor de la mascota
            petContainerRef.current?.measure((cx, cy, cw, ch, cPageX, cPageY) => {
              // Calcular posición relativa del jabón respecto al contenedor
              const relativeX = sPageX - cPageX + sw / 2;
              const relativeY = sPageY - cPageY + sh / 2;
              
              // Crear SOLO UNA burbuja por colisión con un pequeño offset aleatorio
              const offsetX = (Math.random() - 0.5) * 20;
              const offsetY = (Math.random() - 0.5) * 20;
              
              createBubble(relativeX + offsetX, relativeY + offsetY);
            });
          }
        }
      });
    });
  };

  return {
    petRef,
    soapRef,
    petContainerRef,
    checkCollision,
  };
};