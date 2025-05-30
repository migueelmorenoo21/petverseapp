import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Bubble } from '../hooks/useBubbles';

export const AnimatedBubble = ({ bubble, onRemove }: { bubble: Bubble; onRemove: () => void }) => {
  // Solo crear SharedValues para el movimiento
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  useEffect(() => {
    // Solo animación de movimiento aleatorio
    const randomX = (Math.random() - 0.5) * 100;
    const randomY = -Math.random() * 50 - 30; // Siempre hacia arriba
    
    translateX.value = withTiming(randomX, { 
      duration: 2000, 
      easing: Easing.inOut(Easing.ease) 
    });
    translateY.value = withTiming(randomY, { 
      duration: 2000, 
      easing: Easing.out(Easing.ease) 
    });

    // Eliminar la burbuja después de 2 segundos
    const timeout = setTimeout(() => {
      runOnJS(onRemove)();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [bubble.id, onRemove, translateX, translateY]);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: bubble.x,
          top: bubble.y,
          width: 40,
          height: 40,
          backgroundColor: 'rgba(173, 216, 230, 0.8)', // Color azul claro temporal para ver la burbuja
          borderRadius: 20,
        },
        animatedStyle,
      ]}
    >
      {/* Imagen comentada por el momento */}
      {/* <Image
        source={require('../assets/bubble.png')}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
      /> */}
      <Text style={{ textAlign: 'center', lineHeight: 40 }}>💧</Text>
    </Animated.View>
  );
};