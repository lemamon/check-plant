import React from 'react';
import { StyleSheet } from 'react-native';
import { Callout } from 'react-native-maps';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { AdjustedAnnotation } from '@/hooks/useAdjustedAnnotations';
import { ANNOTATION_STYLES, ANNOTATION_TEXTS } from '@/constants/MapConstants';

interface AnnotationCalloutProps {
  annotation: AdjustedAnnotation;
  formatDateTime: (dateTimeString: string) => string;
}

export function AnnotationCallout({ annotation, formatDateTime }: AnnotationCalloutProps) {
  const isPositionAdjusted = annotation.adjustedLatitude !== annotation.latitude;

  return (
    <Callout>
      <ThemedView style={styles.calloutContainer}>
        <ThemedText type="defaultSemiBold">{annotation.annotation}</ThemedText>
        <ThemedText>{formatDateTime(annotation.datetime)}</ThemedText>
        <ThemedText>
          Status: {annotation.synced ? ANNOTATION_TEXTS.SYNCED_STATUS : ANNOTATION_TEXTS.NOT_SYNCED_STATUS}
        </ThemedText>
        {isPositionAdjusted && (
          <ThemedText style={styles.adjustedLocationText}>
            {ANNOTATION_TEXTS.ADJUSTED_POSITION_WARNING}
          </ThemedText>
        )}
      </ThemedView>
    </Callout>
  );
}

const styles = StyleSheet.create({
  calloutContainer: {
    width: ANNOTATION_STYLES.CALLOUT.WIDTH,
    padding: ANNOTATION_STYLES.CALLOUT.PADDING,
    borderRadius: ANNOTATION_STYLES.CALLOUT.BORDER_RADIUS,
  },
  adjustedLocationText: {
    fontSize: ANNOTATION_STYLES.ADJUSTED_LOCATION_TEXT.FONT_SIZE,
    fontStyle: 'italic',
    marginTop: ANNOTATION_STYLES.ADJUSTED_LOCATION_TEXT.MARGIN_TOP,
    color: ANNOTATION_STYLES.ADJUSTED_LOCATION_TEXT.COLOR,
  },
});