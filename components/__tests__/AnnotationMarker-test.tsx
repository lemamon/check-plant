/**
 * Testes para o componente AnnotationMarker
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { AnnotationMarker } from '../AnnotationMarker';
import { AdjustedAnnotation } from '@/hooks/useAdjustedAnnotations';
import { ANNOTATION_STYLES } from '@/constants/MapConstants';

 const mockMarkerFn = jest.fn();
jest.mock('react-native-maps', () => ({
  Marker: (props: any) => {
    mockMarkerFn(props);
    if (props.onPress && typeof props.onPress === 'function') {
      (mockMarkerFn as jest.Mock & { onPressHandler?: () => void }).onPressHandler = props.onPress;
    }
    return props.children || null;
  },
  Callout: (props: { children?: React.ReactNode }) => {
    return props.children || null;
  }
}));

const mockCalloutFn = jest.fn();
jest.mock('../AnnotationCallout', () => ({
  AnnotationCallout: (props: { annotation: AdjustedAnnotation; formatDateTime: (dateTime: string) => string }) => {
    mockCalloutFn(props);
    return null;
  }
}));

describe('AnnotationMarker', () => {
  const onPressMock = jest.fn();
  
  const formatDateTimeMock = jest.fn((dateTimeString: string) => 'Data formatada');
  
  const syncedAnnotation: AdjustedAnnotation = {
    latitude: -15.7801,
    longitude: -47.9292,
    adjustedLatitude: -15.7801,
    adjustedLongitude: -47.9292,
    annotation: 'Teste de anotação sincronizada',
    datetime: '2023-01-01T12:00:00Z',
    synced: true,
    originalIndex: 0
  };
  
  const unsyncedAnnotation: AdjustedAnnotation = {
    latitude: -15.7801,
    longitude: -47.9292,
    adjustedLatitude: -15.7801,
    adjustedLongitude: -47.9292,
    annotation: 'Teste de anotação não sincronizada',
    datetime: '2023-01-01T12:00:00Z',
    synced: false,
    originalIndex: 1
  };
  
  const adjustedAnnotation: AdjustedAnnotation = {
    latitude: -15.7801,
    longitude: -47.9292,
    adjustedLatitude: -15.7801 + 0.0002,
    adjustedLongitude: -47.9292 + 0.0002,
    annotation: 'Teste de anotação com posição ajustada',
    datetime: '2023-01-01T12:00:00Z',
    synced: true,
    originalIndex: 2
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('deve renderizar corretamente um marcador para anotação sincronizada', () => {
    render(
      <AnnotationMarker 
        annotation={syncedAnnotation} 
        onPress={onPressMock} 
        formatDateTime={formatDateTimeMock} 
      />
    );

    expect(mockMarkerFn).toHaveBeenCalledWith(
      expect.objectContaining({
        testID: `marker-${syncedAnnotation.originalIndex}`,
        coordinate: {
          latitude: syncedAnnotation.adjustedLatitude,
          longitude: syncedAnnotation.adjustedLongitude,
        },
        pinColor: ANNOTATION_STYLES.MARKER_COLORS.SYNCED
      })
    );
    
    expect(mockCalloutFn).toHaveBeenCalledWith(
      expect.objectContaining({
        annotation: syncedAnnotation,
        formatDateTime: expect.any(Function)
      })
    );
  });
  
  it('deve renderizar corretamente um marcador para anotação não sincronizada', () => {
    render(
      <AnnotationMarker 
        annotation={unsyncedAnnotation} 
        onPress={onPressMock} 
        formatDateTime={formatDateTimeMock} 
      />
    );
    
    expect(mockMarkerFn).toHaveBeenCalledWith(
      expect.objectContaining({
        testID: `marker-${unsyncedAnnotation.originalIndex}`,
        pinColor: ANNOTATION_STYLES.MARKER_COLORS.NOT_SYNCED
      })
    );
  });
  
  it('deve renderizar corretamente um marcador para anotação com posição ajustada', () => {
    render(
      <AnnotationMarker 
        annotation={adjustedAnnotation} 
        onPress={onPressMock} 
        formatDateTime={formatDateTimeMock} 
      />
    );
    
    expect(mockMarkerFn).toHaveBeenCalledWith(
      expect.objectContaining({
        testID: `marker-${adjustedAnnotation.originalIndex}`,
        coordinate: {
          latitude: adjustedAnnotation.adjustedLatitude,
          longitude: adjustedAnnotation.adjustedLongitude,
        }
      })
    );
  });
  
  it('deve chamar a função onPress quando o marcador é pressionado', () => {
    render(
      <AnnotationMarker 
        annotation={syncedAnnotation} 
        onPress={onPressMock} 
        formatDateTime={formatDateTimeMock} 
      />
    );
    
    expect(mockMarkerFn).toHaveBeenCalled();
    
    const onPressHandler = (mockMarkerFn as jest.Mock & { onPressHandler?: () => void }).onPressHandler;
    
    expect(typeof onPressHandler).toBe('function');
    
    if (onPressHandler) {
      onPressHandler();
    }
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
    expect(onPressMock).toHaveBeenCalledWith(syncedAnnotation);
  });
});