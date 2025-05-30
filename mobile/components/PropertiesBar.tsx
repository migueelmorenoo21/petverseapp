import React from 'react';
import { View, Text } from 'react-native';

// Componente de barra de progreso para mostrar estadísticas
interface ProgressBarProps {
  value: number;
  label: string;
  icon: string;
}

export const ProgressBar = ({ value, label, icon }: ProgressBarProps) => {
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