import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from './ThemedText';

interface SuccessToastProps {
  visible: boolean;
  message: string;
  onComplete?: () => void;
  iconName?: keyof typeof MaterialIcons.glyphMap; // Nome do ícone do MaterialIcons
  iconColor?: string; // Cor do ícone
  iconBackgroundColor?: string; // Cor de fundo do ícone
}

export function SuccessToast({ 
  visible, 
  message, 
  onComplete, 
  iconName = "check", 
  iconColor = "white", 
  iconBackgroundColor = "#4CAF50" 
}: SuccessToastProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const iconScale = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  
  useEffect(() => {
    if (visible) {
      // Animar a entrada do toast
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withTiming(1, { duration: 300 });
      
      // Animar o ícone
      iconScale.value = withDelay(
        200,
        withSequence(
          withTiming(1.2, { duration: 200, easing: Easing.out(Easing.back()) }),
          withTiming(1, { duration: 150 })
        )
      );
      iconOpacity.value = withDelay(200, withTiming(1, { duration: 200 }));
      
      // Adicionar animação de rotação para o ícone de sincronização
      if (iconName === "sync") {
        iconRotation.value = 0;
        iconRotation.value = withRepeat(
          withTiming(360, { duration: 1500, easing: Easing.linear }),
          -1, // -1 significa repetir infinitamente
          false
        );
      }
      
      // Animar a saída do toast após 2 segundos
      const timeout = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 }, (finished) => {
          if (finished && onComplete) {
            runOnJS(onComplete)();
          }
        });
        scale.value = withTiming(0.8, { duration: 300 });
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [visible, iconName]);
  
  const toastAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });
  
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: iconOpacity.value,
      transform: [
        { scale: iconScale.value },
        { rotate: `${iconRotation.value}deg` }
      ],
    };
  });
  
  if (!visible) return null;
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.toast, toastAnimatedStyle]}>
        <View style={styles.content}>
          <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
            <View style={[styles.iconCircle, { backgroundColor: iconBackgroundColor }]}>
              <MaterialIcons name={iconName} size={30} color={iconColor} />
            </View>
          </Animated.View>
          <ThemedText style={styles.message}>{message}</ThemedText>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    pointerEvents: 'none',
  },
  toast: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    maxWidth: Dimensions.get('window').width * 0.8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 12,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});