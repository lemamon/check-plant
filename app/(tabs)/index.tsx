import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/Header";
import { MapContent } from "@/components/MapContent";
import { SyncButton } from "@/components/SyncButton";
import { SuccessToast } from "@/components/SuccessToast";
import { useAnnotations } from "@/hooks/useAnnotations";
import { useSyncProcess } from "@/hooks/useSyncProcess";

export default function HomeScreen() {
  const { annotations, loading, syncAnnotations } = useAnnotations();
  const {
    isSyncing,
    showSyncSuccessToast,
    spin,
    handleSync,
    handleSyncSuccessComplete,
  } = useSyncProcess(syncAnnotations);

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />

      <Header title="CheckPlant" subtitle="Mapa de Anotações" />
      
      <MapContent loading={loading} annotations={annotations} />

      <SyncButton
        onPress={handleSync}
        disabled={isSyncing || loading}
        isSyncing={isSyncing}
        spin={spin}
      />

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
});
