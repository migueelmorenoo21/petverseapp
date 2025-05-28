import { useState } from 'react';
import {
  ImageSourcePropType,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {useFetch, petId, userId} from '../config/config';

 // Variable para controlar si se puede limpiar la mascota
// Función para obtener la imagen de la mascota según su estado
const getPetImage = (
  happiness: number,
  energy: number,
  cleanliness: number
): ImageSourcePropType => {
  // Muestra imagen según nivel de limpieza
  if (cleanliness < 25) {
    return require('../assets/golden/veryDirtyGolden.png');
  } else if (cleanliness <= 50) {
    return require('../assets/golden/dirtyGolden.png');
  }

  // Muestra imagen según nivel de energía
  if (energy < 30) {
    return require('../assets/golden/openMouthGolden.png');
  }

  // Muestra imagen según nivel de felicidad
  if (happiness > 80) {
    return require('../assets/golden/happyGolden.png');
  }

  // Imagen por defecto
  return require('../assets/golden/goldenRetriever.png');
};

// Componente de barra de progreso para mostrar estadísticas
interface ProgressBarProps {
  value: number;
  label: string;
  icon: string;
}

const ProgressBar = ({ value, label, icon }: ProgressBarProps) => {
  // Define el color de la barra según el valor
  const getColorClass = (value: number) => {
    if (value >= 80) return 'bg-green-400';
    if (value >= 50) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <View className="mb-3">
      <View className="flex-row items-center mb-1">
        <Text className="text-base mr-1.5">{icon}</Text>
        <Text className="flex-1 text-sm text-amber-900 font-medium">{label}</Text>
        <Text className="text-xs text-amber-800 font-bold">{value}/100</Text>
      </View>
      <View className="h-3 bg-orange-200 rounded-full overflow-hidden shadow-inner">
        <View
          className={`h-full rounded-full ${getColorClass(value)}`}
          style={{ width: `${value}%` }}
        />
      </View>
    </View>
  );
};

export default function Index() {
  // Estados para acciones
  const [activeTab, setActiveTab] = useState<'feed' | 'sleep' | 'clean' | null>(null);
  
  // Obtiene los datos de la mascota desde la API
  const { data, loading, error } = useFetch(`/api/me/${userId}/${petId}`);

  // Reanimated values para el jabón (animación de arrastre)
  const soapX = useSharedValue(0);
  const soapY = useSharedValue(0);

  // Crear el gesto Pan usando la API de Gesture
const isClean = data?.properties?.cleanliness === 100;

const panGesture = Gesture.Pan()
  .enabled(!isClean)
  .onUpdate((event) => {
    soapX.value = event.translationX;
    soapY.value = event.translationY;
  })
  .onFinalize(() => {
    soapX.value = 0;
    soapY.value = 0;
  });

  const soapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: soapX.value },
      { translateY: soapY.value },
    ],
  }));

  // Manejador de acciones cuando se interactúa con la mascota
  const handleTabPress = (tab: 'feed' | 'sleep' | 'clean') => {
    setActiveTab(tab);
    
    // Aquí iría la lógica para enviar la acción al servidor
    // Por ahora solo cambiamos el estado visual
    // En una implementación completa, se enviaría una petición a la API
  };

  // Obtiene las propiedades de la mascota si existen datos
  const getPetProperty = (property: string, defaultValue: number = 0): number => {
    if (data && data.properties && data.properties[property] !== undefined) {
      return data.properties[property];
    }
    return defaultValue;
  };

  // Renderiza un indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <ImageBackground
        source={require('../assets/background.png')}
        className="flex-1"
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
          <Text className="mt-3 text-amber-800 font-medium">Cargando mascota...</Text>
        </View>
      </ImageBackground>
    );
  }

  // Muestra un mensaje de error si hay problemas con la API
  if (error) {
    return (
      <ImageBackground
        source={require('../assets/background.png')}
        className="flex-1"
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.errorContainer}>
          <Text className="text-red-600 font-bold text-lg">Error al cargar los datos</Text>
          <Text className="text-red-500 mt-2">Por favor, intenta de nuevo más tarde</Text>
          <Text className="text-red-500 mt-2 text-xs">{error.toString()}</Text>
        </View>
      </ImageBackground>
    );
  }

  // Obtiene las estadísticas actuales de la mascota
  const hunger = getPetProperty('hunger');
  const energy = getPetProperty('energy');
  const cleanliness = getPetProperty('cleanliness');
  const happiness = getPetProperty('happiness');
  const health = getPetProperty('health');
  const especie = data?.properties?.especie || "Mascota";

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      className="flex-1"
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1">
        <View className="bg-white/95 mx-5 mt-5 p-5 rounded-2xl shadow-md">
          <View className="items-center mb-4">
            <Text className="text-3xl font-bold text-amber-900 mb-1">
              {data?.petName || "Mi mascota"}
            </Text>
            <Text className="text-base text-amber-700">
              {especie}
            </Text>
          </View>
            <View>
            <ProgressBar value={hunger} label="Hambre" icon="🍽️" />
            <ProgressBar value={energy} label="Energía" icon="⚡" />
            <ProgressBar value={cleanliness} label="Limpieza" icon="✨" />
            <ProgressBar value={happiness} label="Felicidad" icon="😊" />
            <ProgressBar value={health} label="Salud" icon="❤️" />
            </View>
        </View>

        <View style={styles.petContainer}>
          <Image
            source={getPetImage(happiness, energy, cleanliness)}
            style={styles.petImage}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.bottomNav]} className="flex-row justify-around items-center">
          <TouchableOpacity 
            style={styles.navButton} 
            className={activeTab === 'feed' ? 'bg-amber-200/30' : ''}
            onPress={() => handleTabPress('feed')}
          >
            <Image
              source={require('../assets/comedero.png')}
              style={styles.feedIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navButton} 
            className={activeTab === 'sleep' ? 'bg-amber-200/30' : ''}
            onPress={() => handleTabPress('sleep')}
          >
            <Text style={styles.sleepIcon}>😴</Text>
          </TouchableOpacity>

          <GestureDetector gesture={panGesture}>
            <Animated.View 
              style={[styles.navButton, soapStyle]} 
              className={activeTab === 'clean' ? 'bg-amber-200/30' : ''}
            >
              <TouchableOpacity
                style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                if (data && data.properties && data.properties.cleanliness === 100) {
                  console.log('La mascota ya está limpia');
                  return;
                  }
                  handleTabPress('clean');
                }}
                >
                <Image
                  source={require('../assets/soap.png')}
                  style={styles.cleanIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </Animated.View>
          </GestureDetector>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  petContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  petImage: {
    width: 200,
    height: 200,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 145,
    width: '100%',
    paddingHorizontal: 40,
    gap: 30,
  },
  navButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  feedIcon: {
    width: 100,
    height: 100,
  },
  sleepIcon: {
    fontSize: 50,
  },
  cleanIcon: {
    width: 100, 
    height: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});