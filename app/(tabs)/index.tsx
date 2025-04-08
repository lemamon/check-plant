import {
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AnnotationMap } from "@/components/AnnotationMap";
import { SuccessToast } from "@/components/SuccessToast";
import { useAnnotations } from "@/hooks/useAnnotations";

export default function HomeScreen() {
  const { annotations, loading, syncAnnotations } = useAnnotations();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncSuccessToast, setShowSyncSuccessToast] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  const startSpinAnimation = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopSpinAnimation = () => {
    spinValue.stopAnimation();
  };

  const handleSyncSuccessComplete = () => {
    setShowSyncSuccessToast(false);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleSync = async () => {
    setIsSyncing(true);
    startSpinAnimation();

    try {
      const email = "demmarinho@gmail.com";
      const success = await syncAnnotations(email);

      if (success) {
        setShowSyncSuccessToast(true);
      } else {
        Alert.alert("Erro", "Não foi possível sincronizar as anotações.");
      }
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      Alert.alert("Erro", "Ocorreu um erro durante a sincronização.");
    } finally {
      setIsSyncing(false);
      stopSpinAnimation();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />

      <ThemedView style={styles.header}>
        <ThemedText type="title">CheckPlant</ThemedText>
        <ThemedText type="subtitle">Mapa de Anotações</ThemedText>
      </ThemedView>

      {loading ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <ThemedText>Carregando anotações...</ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={styles.mapContainer}>
          <AnnotationMap annotations={annotations} />
        </ThemedView>
      )}

      <TouchableOpacity
        style={styles.fabContainer}
        onPress={handleSync}
        disabled={isSyncing || loading}
      >
        <Animated.View
          style={{ transform: [{ rotate: isSyncing ? spin : "0deg" }] }}
        >
          <MaterialIcons name="sync" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>

      <SuccessToast
        visible={showSyncSuccessToast}
        message="Anotações sincronizadas com sucesso!"
        onComplete={handleSyncSuccessComplete}
        iconName="sync"
        iconBackgroundColor="#2196F3"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 16,
    gap: 8,
  },
  mapContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
