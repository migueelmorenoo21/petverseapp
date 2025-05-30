import { useFetch } from '../config/config';

interface PetData {
  petName?: string;
  properties?: {
    [key: string]: number | string | undefined;
    hunger?: number;
    energy?: number;
    cleanliness?: number;
    happiness?: number;
    health?: number;
    especie?: string;
  };
}

interface UsePetPropertiesReturn {
  data: PetData | null;
  loading: boolean;
  error: any;
  refetch: () => void;
  getPetProperty: (property: string, defaultValue?: number) => number;
  hunger: number;
  energy: number;
  cleanliness: number;
  happiness: number;
  health: number;
  especie: string;
}

export const useGetPetProperties = (
  userId: string,
  petId: string
): UsePetPropertiesReturn => {
  // Obtiene los datos de la mascota desde la API
  const { data, loading, error, refetch } = useFetch(`/api/me/${userId}/${petId}`);

  // Función para obtener las propiedades de la mascota si existen datos
  const getPetProperty = (property: string, defaultValue: number = 0): number => {
    if (data && data.properties && data.properties[property] !== undefined) {
      return data.properties[property] as number;
    }
    return defaultValue;
  };

  // Obtiene las estadísticas actuales de la mascota
  const hunger = getPetProperty('hunger');
  const energy = getPetProperty('energy');
  const cleanliness = getPetProperty('cleanliness');
  const happiness = getPetProperty('happiness');
  const health = getPetProperty('health');
  const especie = (data?.properties?.especie as string) || "Mascota";

  return {
    data,
    loading,
    error,
    refetch,
    getPetProperty,
    hunger,
    energy,
    cleanliness,
    happiness,
    health,
    especie,
  };
};