import { useState } from 'react';
import {
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
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { userId, petId, API_URL, energyPerHour } from '../config/config';
import { useBubbles } from '../hooks/useBubbles';
import { useSleep, SleepOption } from '../hooks/useSleep';
import { getPetImage } from '../hooks/usePetImage';
import { useGetPetProperties } from '../hooks/useGetPetProperties';
import { useCheckCollision } from '../hooks/useCheckColision';
import SleepModal from '../components/SleepModal';
import { AnimatedBubble } from '../components/AnimatedBubble';
import { ProgressBar } from '../components/PropertiesBar';

export default function Index() {
  // Estados para acciones
  const [activeTab, setActiveTab] = useState<'feed' | 'sleep' | 'clean' | null>(null);
  const [showSleepModal, setShowSleepModal] = useState(false);
  
  // Hooks personalizados
  const { bubbles, createBubble, removeBubble } = useBubbles();
  const { sendSleepRequest, isLoading: isSleepLoading, error: sleepError, clearError } = useSleep({
    userId,
    petId,
    apiUrl: API_URL,
    energyPerHour,
  });
  
  // Hook para obtener las propiedades de la mascota
  const {
    data,
    loading,
    error,
    refetch,
    hunger,
    energy,
    cleanliness,
    happiness,
    health,
    especie,
  } = useGetPetProperties(userId, petId);

  // Hook para manejar las colisiones
  const { petRef, soapRef, petContainerRef, checkCollision } = useCheckCollision({
    createBubble,
    bubbleCooldown: 500, // 500ms = 0.5 segundos
  });

  // Reanimated values para el jabón (animación de arrastre)
  const soapX = useSharedValue(0);
  const soapY = useSharedValue(0);

  // Crear el gesto Pan usando la API de Gesture
  const isClean = cleanliness === 100;

  const panGesture = Gesture.Pan()
    .enabled(!isClean) // Deshabilita el gesto si la mascota está completamente limpia
    .onUpdate((event) => {
      soapX.value = event.translationX;
      soapY.value = event.translationY;
      // Ejecuta la detección de colisión en el hilo de JS
      runOnJS(checkCollision)();
    })
    .onEnd(() => {
      // Anima el regreso a la posición original
      soapX.value = withSpring(0);
      soapY.value = withSpring(0);
    });

  const soapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: soapX.value },
      { translateY: soapY.value },
    ],
  }));

  // Manejador para abrir el modal de sueño
  const handleSleepPress = () => {
    setActiveTab('sleep');
    setShowSleepModal(true);
    clearError(); // Limpiar errores previos
  };

  // Manejador para seleccionar una opción de sueño
  const handleSelectSleep = async (option: SleepOption) => {
    const success = await sendSleepRequest(option);
    
    if (success) {
      // Refrescar los datos de la mascota para ver los cambios
      refetch();
    } else if (sleepError) {
      // Aquí podrías mostrar un Toast o algún mensaje de error al usuario
      console.error('Error en la petición de sueño:', sleepError);
    }
    
    setActiveTab(null);
  };

  // Manejador para cerrar el modal de sueño
  const handleCloseSleepModal = () => {
    setShowSleepModal(false);
    setActiveTab(null);
    clearError(); // Limpiar errores al cerrar
  };

  // Manejador de acciones cuando se interactúa con la mascota
  const handleTabPress = (tab: 'feed' | 'sleep' | 'clean') => {
    if (tab === 'sleep') {
      handleSleepPress();
    } else {
      setActiveTab(tab);
      // Aquí iría la lógica para enviar la acción al servidor
      // Por ahora solo cambiamos el estado visual
      // En una implementación completa, se enviaría una petición a la API
    }
  };

  // Renderiza un indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
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
      </GestureHandlerRootView>
    );
  }

  // Muestra un mensaje de error si hay problemas con la API
  if (error) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
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
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/background.png')}
        className="flex-1"
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1">
          {/* Panel de estadísticas de la mascota */}
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

          {/* Contenedor de la mascota con referencia para colisiones */}
          <View ref={petContainerRef} style={styles.petContainer}>
            <View ref={petRef} style={styles.petImageWrapper}>
              <Image
                source={getPetImage(happiness, energy, cleanliness)}
                style={styles.petImage}
                resizeMode="contain"
              />
            </View>
            
            {/* Renderizar burbujas con keys únicas usando el componente AnimatedBubble */}
            {bubbles.map((bubble) => (
              <AnimatedBubble
                key={`bubble-${bubble.id}`}
                bubble={bubble}
                onRemove={() => removeBubble(bubble.id)}
              />
            ))}
          </View>

          {/* Barra de navegación inferior con botones de acción */}
          <View style={[styles.bottomNav]} className="flex-row justify-around items-center">
            {/* Botón de alimentar */}
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

            {/* Botón de dormir */}
            <TouchableOpacity 
              style={styles.navButton} 
              className={activeTab === 'sleep' ? 'bg-amber-200/30' : ''}
              onPress={() => handleTabPress('sleep')}
              disabled={isSleepLoading}
            >
              {isSleepLoading ? (
                <ActivityIndicator size="small" color="#F59E0B" />
              ) : (
                <Text style={styles.sleepIcon}>😴</Text>
              )}
            </TouchableOpacity>

            {/* Botón de limpiar con detección de gestos */}
            <GestureDetector gesture={panGesture}>
              <Animated.View 
                ref={soapRef}
                style={[styles.navButton, soapStyle]} 
                className={activeTab === 'clean' ? 'bg-amber-200/30' : ''}
              >
                <TouchableOpacity
                  style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => handleTabPress('clean')}
                >
                  <Image
                    source={require('../assets/soap.png')}
                    style={[styles.cleanIcon, isClean && styles.disabledIcon]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </Animated.View>
            </GestureDetector>
          </View>

          {/* Modal de sueño - Ya no necesita currentEnergy como prop */}
          <SleepModal
            visible={showSleepModal}
            onClose={handleCloseSleepModal}
            onSelectSleep={handleSelectSleep}
          />

          {/* Mostrar error de sleep si existe */}
          {sleepError && (
            <View style={styles.errorToast}>
              <Text style={styles.errorToastText}>Error: {sleepError}</Text>
              <TouchableOpacity onPress={clearError}>
                <Text style={styles.errorToastClose}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  petContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  petImageWrapper: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petImage: {
    width: '100%',
    height: '100%',
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
  disabledIcon: {
    opacity: 0.5,
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
  errorToast: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#FF5252',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorToastText: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
  errorToastClose: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});