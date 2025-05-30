import { ImageSourcePropType } from 'react-native';

// Función para obtener la imagen de la mascota según su estado
export const getPetImage = (
  happiness: number,
  energy: number,
  cleanliness: number
): ImageSourcePropType => {
  // Muestra imagen según nivel de limpieza
  if (cleanliness < 25) {
    return require('../assets/golden/dirtyGolden.png'); // Muy sucio
  } else if (cleanliness >= 25 && cleanliness < 45) {
    return require('../assets/golden/veryDirtyGolden.png'); // Estado intermedio
  } else if (cleanliness >= 45 && cleanliness <= 65) {
    return require('../assets/golden/veryDirtyGolden.png'); // Estado intermedio
  }

  // Muestra imagen según nivel de energía (solo si la limpieza es buena)
  if (energy < 30) {
    return require('../assets/golden/openMouthGolden.png');
  }

  // Muestra imagen según nivel de felicidad (solo si energía y limpieza están bien)
  if (happiness > 80) {
    return require('../assets/golden/happyGolden.png');
  }

  // Imagen por defecto
  return require('../assets/golden/goldenRetriever.png');
};