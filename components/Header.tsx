import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
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
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    gap: 8,
  },
});