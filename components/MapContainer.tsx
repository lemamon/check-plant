import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { Annotation } from '@/types';
import { AnnotationMarker } from './AnnotationMarker';
import { AdjustedAnnotation } from '@/hooks/useAdjustedAnnotations';

interface MapContainerProps {
  adjustedAnnotations: AdjustedAnnotation[];
  onSelectAnnotation: (annotation: Annotation) => void;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  formatDateTime: (dateTimeString: string) => string;
}

import { DEFAULT_MAP_REGION } from '@/constants/MapConstants';

export function MapContainer({ 
  adjustedAnnotations, 
  onSelectAnnotation, 
  initialRegion, 
  formatDateTime 
}: MapContainerProps) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion || DEFAULT_MAP_REGION}
        showsUserLocation
        showsMyLocationButton
      >
        {adjustedAnnotations && adjustedAnnotations.length > 0 ? adjustedAnnotations.map((item) => (
          <AnnotationMarker
            key={`${item.latitude}-${item.longitude}-${item.originalIndex}`}
            annotation={item}
            onPress={onSelectAnnotation}
            formatDateTime={formatDateTime}
          />
        )) : null}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});