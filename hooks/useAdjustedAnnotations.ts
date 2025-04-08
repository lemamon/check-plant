import { useState, useEffect } from 'react';
import { Annotation } from '@/types';
import { ANNOTATION_CONSTANTS } from '@/constants/MapConstants';

export interface AdjustedAnnotation extends Annotation {
  adjustedLatitude: number;
  adjustedLongitude: number;
  originalIndex: number;
}

export function useAdjustedAnnotations(annotations: Annotation[]) {
  const [adjustedAnnotations, setAdjustedAnnotations] = useState<AdjustedAnnotation[]>([]);
  
  const { OFFSET_BASE, PROXIMITY_THRESHOLD, ANGLE_INCREMENT, POINTS_PER_REVOLUTION } = ANNOTATION_CONSTANTS;
  
  useEffect(() => {
    if (!annotations || annotations.length === 0) {
      setAdjustedAnnotations([]);
      return;
    }
    
    const adjusted: AdjustedAnnotation[] = annotations.map((ann, index) => ({
      ...ann,
      adjustedLatitude: ann.latitude,
      adjustedLongitude: ann.longitude,
      originalIndex: index
    }));
    
    const groups: AdjustedAnnotation[][] = [];
    
    adjusted.forEach(annotation => {
      let foundGroup = false;
      
      for (const group of groups) {
        const firstInGroup = group[0];
        const isClose = 
          Math.abs(annotation.latitude - firstInGroup.latitude) < PROXIMITY_THRESHOLD &&
          Math.abs(annotation.longitude - firstInGroup.longitude) < PROXIMITY_THRESHOLD;
        
        if (isClose) {
          group.push(annotation);
          foundGroup = true;
          break;
        }
      }
      
      if (!foundGroup) {
        groups.push([annotation]);
      }
    });
    
    groups.forEach(group => {
      if (group.length <= 1) return;
      
      for (let i = 1; i < group.length; i++) {
        const angle = (i * ANGLE_INCREMENT) % 360; 
        const radius = OFFSET_BASE * (1 + Math.floor(i / POINTS_PER_REVOLUTION)); 
        
        const rad = angle * (Math.PI / 180);
        
        const offsetLat = radius * Math.sin(rad);
        const offsetLng = radius * Math.cos(rad);
        
        group[i].adjustedLatitude = group[0].latitude + offsetLat;
        group[i].adjustedLongitude = group[0].longitude + offsetLng;
      }
    });
    
    setAdjustedAnnotations(adjusted);
  }, [annotations]);

  return adjustedAnnotations;
}