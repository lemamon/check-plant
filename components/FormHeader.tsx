import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type FormHeaderProps = {
  title: string;
  subtitle: string;
};

export function FormHeader({ title, subtitle }: FormHeaderProps) {
  return (
    <ThemedView style={styles.header}>
      <ThemedText type="title">{title}</ThemedText>
      <ThemedText type="subtitle">{subtitle}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 16,
    gap: 8,
  },
});
