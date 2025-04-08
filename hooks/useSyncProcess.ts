import { useState } from 'react';
import { Alert } from 'react-native';
import { useSyncAnimation } from './useSyncAnimation';

export function useSyncProcess(syncAnnotations: (email: string) => Promise<boolean>) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncSuccessToast, setShowSyncSuccessToast] = useState(false);
  const { spin, startSpinAnimation, stopSpinAnimation } = useSyncAnimation();

  const handleSyncSuccessComplete = () => {
    setShowSyncSuccessToast(false);
  };

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

  return {
    isSyncing,
    showSyncSuccessToast,
    spin,
    handleSync,
    handleSyncSuccessComplete,
  };
}