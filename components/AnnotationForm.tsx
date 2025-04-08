import React from 'react';
import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type AnnotationFormProps = {
  annotation: string;
  loading: boolean;
  isButtonEnabled: boolean;
  onChangeText: (text: string) => void;
  onSave: () => void;
};

export function AnnotationForm({
  annotation,
  loading,
  isButtonEnabled,
  onChangeText,
  onSave,
}: AnnotationFormProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.formContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={styles.label}>Anotação:</ThemedText>
        <TextInput
          style={styles.textInput}
          placeholder="Digite sua anotação aqui..."
          value={annotation}
          onChangeText={onChangeText}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />

        <ThemedView style={styles.buttonContainer}>
          <ThemedText
            style={[
              styles.button,
              (!isButtonEnabled || loading) && styles.disabledButton,
            ]}
            onPress={!isButtonEnabled || loading ? undefined : onSave}
          >
            {loading ? "Salvando..." : "Salvar Anotação"}
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    padding: 12,
    backgroundColor: "#ffffff",
    minHeight: 150,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 15,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    overflow: "hidden",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
