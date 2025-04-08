import React from 'react';
import { Marker } from 'react-native-maps';
import { AdjustedAnnotation } from '@/hooks/useAdjustedAnnotations';
import { AnnotationCallout } from './AnnotationCallout';
import { ANNOTATION_STYLES } from '@/constants/MapConstants';

interface AnnotationMarkerProps {
  annotation: AdjustedAnnotation;
  onPress: (annotation: AdjustedAnnotation) => void;
  formatDateTime: (dateTimeString: string) => string;
}

export function AnnotationMarker({ annotation, onPress, formatDateTime }: AnnotationMarkerProps) {
  
  return (
    <Marker
      testID={`marker-${annotation.originalIndex}`}
      key={`${annotation.latitude}-${annotation.longitude}-${annotation.originalIndex}`}
      coordinate={{
        latitude: annotation.adjustedLatitude,
        longitude: annotation.adjustedLongitude,
      }}
      pinColor={annotation.synced ? ANNOTATION_STYLES.MARKER_COLORS.SYNCED : ANNOTATION_STYLES.MARKER_COLORS.NOT_SYNCED}
      onPress={() => onPress(annotation)}
    >
      <AnnotationCallout 
        annotation={annotation} 
        formatDateTime={formatDateTime} 
      />
    </Marker>
  );
}