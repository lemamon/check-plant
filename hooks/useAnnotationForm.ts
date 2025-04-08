import { useState } from 'react';
import * as Location from "expo-location";
import { Alert } from 'react-native';
import * as Haptics from "expo-haptics";
import { useAnnotations } from './useAnnotations';

export const useAnnotationForm = () => {
  const [annotation, setAnnotation] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const { addAnnotation, refreshAnnotations } = useAnnotations();

  const updateButtonState = (text: string) => {
    setIsButtonEnabled(text.trim().length > 3);
  };

  const resetForm = () => {
    setAnnotation("");
    setIsButtonEnabled(false);
    setLoading(false);
    setShowSuccessToast(false);
  };

  const handleSave = async () => {
    if (!annotation.trim()) {
      Alert.alert("Erro", "Por favor, digite uma anotação.");
      return;
    }

    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Erro", "Permissão para acessar a localização foi negada.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      const newAnnotation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        annotation: annotation.trim(),
        datetime: new Date().toISOString(),
      };

      const success = await addAnnotation(newAnnotation);

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setAnnotation("");
        setShowSuccessToast(true);
      }
    } catch (error) {
      console.error("Erro ao salvar anotação:", error);
      Alert.alert("Erro", "Não foi possível salvar a anotação.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (text: string) => {
    setAnnotation(text);
    updateButtonState(text);
  };

  return {
    annotation,
    loading,
    showSuccessToast,
    isButtonEnabled,
    setShowSuccessToast,
    handleTextChange,
    handleSave,
    resetForm,
    refreshAnnotations
  };
};
