import React from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

interface SyncButtonProps {
  onPress: () => void;
  disabled: boolean;
  isSyncing: boolean;
  spin: Animated.AnimatedInterpolation<string>;
}

export function SyncButton({ onPress, disabled, isSyncing, spin }: SyncButtonProps) {
  return (
    <TouchableOpacity
      style={styles.fabContainer}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View
        style={{ transform: [{ rotate: isSyncing ? spin : "0deg" }] }}
      >
        <MaterialIcons name="sync" size={24} color="white" />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 80,
    left: 20,
    backgroundColor: "#4CAF50",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});