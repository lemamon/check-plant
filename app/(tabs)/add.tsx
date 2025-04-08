import { StyleSheet } from "react-native";
import { useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";

import { ThemedView } from "@/components/ThemedView";
import { SuccessToast } from "@/components/SuccessToast";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { FormHeader } from "@/components/FormHeader";
import { AnnotationForm } from "@/components/AnnotationForm";
import { useAnnotationForm } from "@/hooks/useAnnotationForm";

export default function AddScreen() {
  const {
    annotation,
    loading,
    showSuccessToast,
    isButtonEnabled,
    handleTextChange,
    handleSave,
    resetForm,
    refreshAnnotations
  } = useAnnotationForm();

  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, [])
  );

  const handleSuccessComplete = () => {
    refreshAnnotations().then(() => {
      router.replace("/");
    });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="pencil"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.container}>
        <StatusBar style="auto" />

        <FormHeader 
          title="Adicionar Anotação" 
          subtitle="Registre suas observações" 
        />

        <AnnotationForm
          annotation={annotation}
          loading={loading}
          isButtonEnabled={isButtonEnabled}
          onChangeText={handleTextChange}
          onSave={handleSave}
        />

        <SuccessToast
          visible={showSuccessToast}
          message="Anotação adicionada com sucesso!"
          onComplete={handleSuccessComplete}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  headerImage: {
    color: "#808080",
    bottom: -20,
    right: 20,
    position: "absolute",
  },
});
