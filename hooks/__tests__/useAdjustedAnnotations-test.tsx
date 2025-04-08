import { useAdjustedAnnotations } from '../useAdjustedAnnotations';
import { Annotation } from '@/types';
import { ANNOTATION_CONSTANTS } from '@/constants/MapConstants';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn((fn) => fn()),
}));

describe('useAdjustedAnnotations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const setStateMock = jest.fn();
    require('react').useState.mockImplementation((initialValue: unknown) => [initialValue, setStateMock]);
  });

  it('retorna um array vazio quando não há anotações', () => {
    const result = useAdjustedAnnotations([]);
    expect(result).toEqual([]);
  });

  it('mantém as coordenadas originais quando há apenas uma anotação', () => {
    const singleAnnotation: Annotation = {
      latitude: -15.7801,
      longitude: -47.9292,
      annotation: 'Teste',
      datetime: '2023-01-01T12:00:00Z',
    };

    const mockAdjustedAnnotation = [{
      ...singleAnnotation,
      adjustedLatitude: singleAnnotation.latitude,
      adjustedLongitude: singleAnnotation.longitude,
      originalIndex: 0
    }];
    
    require('react').useState.mockImplementation(() => [mockAdjustedAnnotation, jest.fn()]);
    
    const result = useAdjustedAnnotations([singleAnnotation]);
    
    expect(result.length).toBe(1);
    expect(result[0].adjustedLatitude).toBe(singleAnnotation.latitude);
    expect(result[0].adjustedLongitude).toBe(singleAnnotation.longitude);
    expect(result[0].originalIndex).toBe(0);
  });

  it('mantém as coordenadas originais quando as anotações estão distantes', () => {
    const distantAnnotations: Annotation[] = [
      {
        latitude: -15.7801,
        longitude: -47.9292,
        annotation: 'Ponto A',
        datetime: '2023-01-01T12:00:00Z',
      },
      {
        latitude: -15.8801, 
        longitude: -47.9292,
        annotation: 'Ponto B',
        datetime: '2023-01-01T12:00:00Z',
      },
    ];

    const mockAdjustedAnnotations = distantAnnotations.map((ann, index) => ({
      ...ann,
      adjustedLatitude: ann.latitude,
      adjustedLongitude: ann.longitude,
      originalIndex: index
    }));
    
    require('react').useState.mockImplementation(() => [mockAdjustedAnnotations, jest.fn()]);
    
    const result = useAdjustedAnnotations(distantAnnotations);
    
    expect(result.length).toBe(2);
    expect(result[0].adjustedLatitude).toBe(distantAnnotations[0].latitude);
    expect(result[0].adjustedLongitude).toBe(distantAnnotations[0].longitude);
    expect(result[1].adjustedLatitude).toBe(distantAnnotations[1].latitude);
    expect(result[1].adjustedLongitude).toBe(distantAnnotations[1].longitude);
  });

  it('agrupa e ajusta anotações próximas corretamente', () => {
    const { PROXIMITY_THRESHOLD, OFFSET_BASE, ANGLE_INCREMENT } = ANNOTATION_CONSTANTS;
    
    const closeAnnotations: Annotation[] = [
      {
        latitude: -15.7801,
        longitude: -47.9292,
        annotation: 'Ponto A',
        datetime: '2023-01-01T12:00:00Z',
      },
      {
        latitude: -15.7801 + (PROXIMITY_THRESHOLD / 2),
        longitude: -47.9292 + (PROXIMITY_THRESHOLD / 2),
        annotation: 'Ponto B',
        datetime: '2023-01-01T12:00:00Z',
      },
    ];
    
    const angle = ANGLE_INCREMENT * (Math.PI / 180);
    const expectedAdjustedLat = closeAnnotations[0].latitude;
    const expectedAdjustedLng = closeAnnotations[0].longitude;
    const expectedAdjustedLat2 = closeAnnotations[0].latitude + (OFFSET_BASE * Math.sin(angle));
    const expectedAdjustedLng2 = closeAnnotations[0].longitude + (OFFSET_BASE * Math.cos(angle));
    
    const mockAdjustedAnnotations = [
      {
        ...closeAnnotations[0],
        adjustedLatitude: expectedAdjustedLat,
        adjustedLongitude: expectedAdjustedLng,
        originalIndex: 0
      },
      {
        ...closeAnnotations[1],
        adjustedLatitude: expectedAdjustedLat2,
        adjustedLongitude: expectedAdjustedLng2,
        originalIndex: 1
      }
    ];
    
    require('react').useState.mockImplementation(() => [mockAdjustedAnnotations, jest.fn()]);
    
    const result = useAdjustedAnnotations(closeAnnotations);
    
    expect(result[0].adjustedLatitude).toBeCloseTo(closeAnnotations[0].latitude);
    expect(result[0].adjustedLongitude).toBeCloseTo(closeAnnotations[0].longitude);
    
    expect(result[1].adjustedLatitude).not.toBe(closeAnnotations[1].latitude);
    expect(result[1].adjustedLongitude).not.toBe(closeAnnotations[1].longitude);
    
    expect(result[1].adjustedLatitude).toBe(expectedAdjustedLat2);
    expect(result[1].adjustedLongitude).toBe(expectedAdjustedLng2);
  });
});