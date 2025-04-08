import React, { useState } from 'react';
import { Annotation } from '@/types';
import { useAdjustedAnnotations } from '@/hooks/useAdjustedAnnotations';
import { formatDateTime } from '@/utils/dateFormatter';
import { MapContainer } from './MapContainer';

interface AnnotationMapProps {
  annotations: Annotation[];
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export function AnnotationMap({ annotations, initialRegion }: AnnotationMapProps) {
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  
  const adjustedAnnotations = useAdjustedAnnotations(annotations);

  const handleSelectAnnotation = (annotation: Annotation) => {
    setSelectedAnnotation(annotation);
  };

  return (
    <MapContainer
      adjustedAnnotations={adjustedAnnotations}
      onSelectAnnotation={handleSelectAnnotation}
      initialRegion={initialRegion}
      formatDateTime={formatDateTime}
    />
  );
}