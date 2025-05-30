import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useGetPetProperties } from '../hooks/useGetPetProperties';
import { userId, petId } from '../config/config';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SleepOption {
  id: string;
  duration: number;
  label: string;
  icon: string;
  energy: number;
  description: string;
}

interface SleepModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSleep: (option: SleepOption) => void;
}

const sleepOptions: SleepOption[] = [
  {
    id: 'nap',
    duration: 1,
    label: 'Siesta Rápida',
    icon: '😴',
    energy: 20,
    description: 'Una siesta corta para recargar un poco',
  },
  {
    id: 'sleep',
    duration: 4,
    label: 'Sueño Normal',
    icon: '😪',
    energy: 50,
    description: 'Un buen descanso para recuperar energía',
  },
  {
    id: 'deep-sleep',
    duration: 8,
    label: 'Sueño Profundo',
    icon: '🛌',
    energy: 100,
    description: 'Descanso completo para máxima energía',
  },
];

const SleepModal: React.FC<SleepModalProps> = ({
  visible,
  onClose,
  onSelectSleep,
}) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  // Usar el hook para obtener las propiedades de la mascota
  const { energy: currentEnergy } = useGetPetProperties(userId, petId);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 25,
        stiffness: 250,
      });
      backdropOpacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 25,
        stiffness: 250,
      });
      backdropOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible, translateY, backdropOpacity]);

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value * 0.5,
  }));

  const handleSelectOption = (option: SleepOption) => {
    // Animar cierre antes de ejecutar la acción
    translateY.value = withSpring(SCREEN_HEIGHT, {
      damping: 25,
      stiffness: 250,
    });
    backdropOpacity.value = withTiming(0, { duration: 300 });
    
    setTimeout(() => {
      onSelectSleep(option);
      onClose();
    }, 300);
  };

  const handleClose = () => {
    translateY.value = withSpring(SCREEN_HEIGHT, {
      damping: 25,
      stiffness: 250,
    });
    backdropOpacity.value = withTiming(0, { duration: 300 });
    
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      {/* Backdrop oscuro */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleClose}
        style={StyleSheet.absoluteFillObject}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: '#000' },
            animatedBackdropStyle,
          ]}
        />
      </TouchableOpacity>

      {/* Modal desplegable */}
      <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
        {/* Handle para arrastrar */}
        <View style={styles.handle} />

        {/* Header del modal */}
        <View style={styles.header}>
          <Text style={styles.title}>💤 Hora de Dormir 💤</Text>
          <Text style={styles.subtitle}>
            Energía actual: {currentEnergy}/100
          </Text>
        </View>

        {/* Opciones de sueño */}
        <ScrollView
          style={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
        >
          {sleepOptions.map((option) => {
            const energyAfterSleep = Math.min(currentEnergy + option.energy, 100);
            const isDisabled = currentEnergy >= 95;

            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  isDisabled && styles.optionCardDisabled,
                ]}
                onPress={() => !isDisabled && handleSelectOption(option)}
                activeOpacity={0.8}
              >
                {/* Icono y contenido principal */}
                <View style={styles.optionContent}>
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionDescription}>
                      {option.description}
                    </Text>
                    <View style={styles.statsRow}>
                      <View style={styles.statBadge}>
                        <Text style={styles.statIcon}>⏱️</Text>
                        <Text style={styles.statText}>{option.duration} h</Text>
                      </View>
                      <View style={[styles.statBadge, styles.energyBadge]}>
                        <Text style={styles.statIcon}>⚡</Text>
                        <Text style={styles.statText}>+{option.energy}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Barra de progreso de energía */}
                <View style={styles.energyPreview}>
                  <View style={styles.energyBarBackground}>
                    <View
                      style={[
                        styles.energyBarCurrent,
                        { width: `${currentEnergy}%` },
                      ]}
                    />
                    <View
                      style={[
                        styles.energyBarPreview,
                        {
                          left: `${currentEnergy}%`,
                          width: `${Math.min(option.energy, 100 - currentEnergy)}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.energyPreviewText}>
                    {currentEnergy} → {energyAfterSleep}
                  </Text>
                </View>

                {/* Decoración de estrellas */}
                <View style={styles.starsDecoration}>
                  {[...Array(3)].map((_, i) => (
                    <Text key={i} style={styles.star}>
                      ⭐
                    </Text>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Mensaje cuando la mascota está llena de energía */}
          {currentEnergy >= 95 && (
            <View style={styles.fullEnergyMessage}>
              <Text style={styles.fullEnergyIcon}>🎉</Text>
              <Text style={styles.fullEnergyText}>
                ¡Tu mascota está llena de energía!
              </Text>
              <Text style={styles.fullEnergySubtext}>
                No necesita dormir ahora
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Botón de cerrar */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          activeOpacity={0.8}
        >
          <Text style={styles.closeButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF8E1',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: SCREEN_HEIGHT * 0.8,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 25,
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8D6E63',
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FFE0B2',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  optionCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#F5F5F5',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  optionIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: '#8D6E63',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  energyBadge: {
    backgroundColor: '#E8F5E9',
  },
  statIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5D4037',
  },
  energyPreview: {
    marginTop: 15,
  },
  energyBarBackground: {
    height: 12,
    backgroundColor: '#FFE0B2',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  energyBarCurrent: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#FFB74D',
    borderRadius: 6,
  },
  energyBarPreview: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#4CAF50',
    opacity: 0.7,
  },
  energyPreviewText: {
    fontSize: 12,
    color: '#8D6E63',
    marginTop: 5,
    textAlign: 'center',
  },
  starsDecoration: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    opacity: 0.3,
  },
  star: {
    fontSize: 12,
    marginLeft: 2,
  },
  fullEnergyMessage: {
    alignItems: 'center',
    padding: 30,
    marginTop: 20,
  },
  fullEnergyIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  fullEnergyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 5,
  },
  fullEnergySubtext: {
    fontSize: 14,
    color: '#8D6E63',
  },
  closeButton: {
    backgroundColor: '#FFAB91',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default SleepModal;