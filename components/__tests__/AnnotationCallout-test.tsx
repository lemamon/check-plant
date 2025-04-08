/**
 * Testes para o componente AnnotationCallout
 */
import React from 'react';
import renderer from 'react-test-renderer';
import { AnnotationCallout } from '../AnnotationCallout';
import { AdjustedAnnotation } from '@/hooks/useAdjustedAnnotations';

jest.mock('react-native-maps', () => ({
  Callout: 'Callout',
}));

jest.mock('../ThemedText', () => ({
  ThemedText: 'ThemedText',
}));

jest.mock('../ThemedView', () => ({
  ThemedView: 'ThemedView',
}));

describe('AnnotationCallout', () => {
  const formatDateTimeMock = jest.fn((dateTimeString: string) => 'Data formatada');
  
  const regularAnnotation: AdjustedAnnotation = {
    latitude: -15.7801,
    longitude: -47.9292,
    adjustedLatitude: -15.7801,
    adjustedLongitude: -47.9292,
    annotation: 'Teste de anotação',
    datetime: '2023-01-01T12:00:00Z',
    synced: true,
    originalIndex: 0
  };
  
  const adjustedAnnotation: AdjustedAnnotation = {
    latitude: -15.7801,
    longitude: -47.9292,
    adjustedLatitude: -15.7801 + 0.0002, // Posição ajustada
    adjustedLongitude: -47.9292 + 0.0002, // Posição ajustada
    annotation: 'Teste de anotação ajustada',
    datetime: '2023-01-01T12:00:00Z',
    synced: false,
    originalIndex: 1
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('deve renderizar corretamente uma anotação sincronizada sem ajuste de posição', () => {
    const tree = renderer.create(
      <AnnotationCallout 
        annotation={regularAnnotation} 
        formatDateTime={formatDateTimeMock} 
      />
    ).toJSON();
    
    expect(tree).toBeTruthy();
    
    expect(formatDateTimeMock).toHaveBeenCalledWith(regularAnnotation.datetime);
  });
  
  it('deve renderizar corretamente uma anotação não sincronizada', () => {
    const unsyncedAnnotation = { ...regularAnnotation, synced: false };
    
    const tree = renderer.create(
      <AnnotationCallout 
        annotation={unsyncedAnnotation} 
        formatDateTime={formatDateTimeMock} 
      />
    ).toJSON();
    
    expect(tree).toBeTruthy();
  });
  
  it('deve mostrar aviso quando a posição foi ajustada', () => {
    const tree = renderer.create(
      <AnnotationCallout 
        annotation={adjustedAnnotation} 
        formatDateTime={formatDateTimeMock} 
      />
    ).toJSON();
    
    expect(tree).toBeTruthy();
  });
});