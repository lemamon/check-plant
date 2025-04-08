import { renderHook, act } from '@testing-library/react-hooks';
import { useAnnotations } from '../useAnnotations';
import { AnnotationService } from '@/services/AnnotationService';

jest.mock('@/services/AnnotationService', () => ({
  AnnotationService: {
    getLocalAnnotations: jest.fn(),
    addAnnotation: jest.fn(),
    syncAnnotations: jest.fn(),
  },
}));

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe('useAnnotations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (AnnotationService.getLocalAnnotations as jest.Mock).mockResolvedValue([]);
    
    (AnnotationService.addAnnotation as jest.Mock).mockResolvedValue(undefined);
    
    (AnnotationService.syncAnnotations as jest.Mock).mockResolvedValue(true);
  });

  it('deve inicializar com dados mockados quando não há anotações locais', async () => {
    (AnnotationService.getLocalAnnotations as jest.Mock).mockResolvedValue([]);
    
    const { result, waitForNextUpdate } = renderHook(() => useAnnotations());
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    
    expect(result.current.annotations.length).toBe(5);
    
    expect(AnnotationService.getLocalAnnotations).toHaveBeenCalledTimes(1);
  });

  it('deve carregar anotações locais quando disponíveis', async () => {
    const testAnnotations = [
      {
        latitude: -15.7801,
        longitude: -47.9292,
        annotation: 'Teste',
        datetime: '2023-01-01T12:00:00Z',
        synced: true
      }
    ];
    
    (AnnotationService.getLocalAnnotations as jest.Mock).mockResolvedValue(testAnnotations);
    
    const { result, waitForNextUpdate } = renderHook(() => useAnnotations());
    
    await waitForNextUpdate();
    
    expect(result.current.annotations).toEqual(testAnnotations);
  });

  it('deve adicionar uma nova anotação com sucesso', async () => {
    const newAnnotation = {
      latitude: -15.7801,
      longitude: -47.9292,
      annotation: 'Nova anotação',
      datetime: '2023-01-01T12:00:00Z',
    };
    
    const { result, waitForNextUpdate } = renderHook(() => useAnnotations());
    
    await waitForNextUpdate();
    let success;
    await act(async () => {
      success = await result.current.addAnnotation(newAnnotation);
    });
    
    expect(success).toBe(true);
    
    expect(AnnotationService.addAnnotation).toHaveBeenCalledWith(newAnnotation);
    expect(AnnotationService.getLocalAnnotations).toHaveBeenCalledTimes(2);
  });

  it('deve sincronizar anotações com sucesso', async () => {
    const testEmail = 'teste@exemplo.com';
    
    const { result, waitForNextUpdate } = renderHook(() => useAnnotations());
    
    await waitForNextUpdate();
    
    let success;
    await act(async () => {
      success = await result.current.syncAnnotations(testEmail);
    });
    
    expect(success).toBe(true);
    
    expect(AnnotationService.syncAnnotations).toHaveBeenCalledWith(testEmail);
    
    expect(AnnotationService.getLocalAnnotations).toHaveBeenCalledTimes(2);
  });

  it('deve lidar com erro ao carregar anotações', async () => {
    (AnnotationService.getLocalAnnotations as jest.Mock).mockRejectedValue(new Error('Erro de teste'));
    
    const { result, waitForNextUpdate } = renderHook(() => useAnnotations());
    
    await waitForNextUpdate();
    
    expect(result.current.annotations.length).toBe(5);
  });

  it('deve lidar com erro ao adicionar anotação', async () => {
    (AnnotationService.addAnnotation as jest.Mock).mockRejectedValue(new Error('Erro de teste'));
    
    const newAnnotation = {
      latitude: -15.7801,
      longitude: -47.9292,
      annotation: 'Nova anotação',
      datetime: '2023-01-01T12:00:00Z',
    };
    
    const { result, waitForNextUpdate } = renderHook(() => useAnnotations());
    
    await waitForNextUpdate();
    
    let success;
    await act(async () => {
      success = await result.current.addAnnotation(newAnnotation);
    });
    
    expect(success).toBe(false);
  });

  it('deve lidar com erro ao sincronizar anotações', async () => {
    (AnnotationService.syncAnnotations as jest.Mock).mockResolvedValue(false);
    
    const testEmail = 'teste@exemplo.com';
    
    const { result, waitForNextUpdate } = renderHook(() => useAnnotations());
    
    await waitForNextUpdate();
    
    let success;
    await act(async () => {
      success = await result.current.syncAnnotations(testEmail);
    });
    
    expect(success).toBe(false);
  });
});