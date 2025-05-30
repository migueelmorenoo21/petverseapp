import { useState } from 'react';

interface SleepOption {
  id: string;
  duration: number;
  label: string;
  icon: string;
  energy: number;
  description: string;
}

interface SleepRequest {
  id: string;        // UUID único para la petición de sueño
  userId: string;
  petId: string;    // UUID del usuario
  sleepTime: string; // Duración del sueño como string
  energyPerHour: number; // Energía por hora
}

interface UseSleepProps {
  userId: string;
  petId: string;
  apiUrl: string;
  energyPerHour: number; // Agregar energyPerHour a las props
}

// Función para generar un UUID simple
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const useSleep = ({ userId, petId, apiUrl, energyPerHour }: UseSleepProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendSleepRequest = async (option: SleepOption): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Convertir la duración a string como espera el backend
      const sleepTimeString = option.duration.toString();
      
      // Generar un UUID único para esta petición de sueño
      const requestId = generateUUID();
      
      const requestBody: SleepRequest = {
        id: requestId,        // UUID único para la petición
        userId: userId,
        petId: petId,       // UUID del usuario
        sleepTime: sleepTimeString,  // Duración como string
        energyPerHour: energyPerHour // Energía por hora
      };

      // Log del endpoint y body que se envía
      const endpoint = `${apiUrl}/api/pets/${userId}/${petId}/sleep`;
      console.log('🔗 [useSleep] Endpoint:', endpoint);
      console.log('📦 [useSleep] Request Body:', JSON.stringify(requestBody, null, 2));
      console.log('🎯 [useSleep] Opción seleccionada:', option);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📊 [useSleep] Response Status:', response.status);
      console.log('📊 [useSleep] Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [useSleep] Error Response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ [useSleep] Respuesta del servidor:', result);
      
      return true; // Éxito
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('💥 [useSleep] Error completo:', err);
      console.error('💥 [useSleep] Error message:', errorMessage);
      setError(errorMessage);
      return false; // Fallo
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    sendSleepRequest,
    isLoading,
    error,
    clearError,
  };
};

// Exportar la interfaz para usar en otros componentes
export type { SleepOption };