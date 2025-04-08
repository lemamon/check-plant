import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { AnnotationMap } from './AnnotationMap';
import { Annotation } from '@/types';

interface MapContentProps {
  loading: boolean;
  annotations: Annotation[];
}

export function MapContent({ loading, annotations }: MapContentProps) {
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText>Carregando anotações...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.mapContainer}>
      <AnnotationMap annotations={annotations} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});