import { renderHook, act } from '@testing-library/react-hooks';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { useAnnotationForm } from '../useAnnotationForm';
import { useAnnotations } from '../useAnnotations';

jest.mock('../useAnnotations', () => ({
  useAnnotations: jest.fn(),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: {
    Success: 'success',
  },
}));

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe('useAnnotationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    const addAnnotationMock = jest.fn().mockResolvedValue(true);
    const refreshAnnotationsMock = jest.fn();
    (useAnnotations as jest.Mock).mockReturnValue({
      addAnnotation: addAnnotationMock,
      refreshAnnotations: refreshAnnotationsMock,
    });
    
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: {
        latitude: -15.7801,
        longitude: -47.9292,
      },
    });
  });

  it('deve inicializar com valores padrão', () => {
    const { result } = renderHook(() => useAnnotationForm());
    
    expect(result.current.annotation).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.showSuccessToast).toBe(false);
    expect(result.current.isButtonEnabled).toBe(false);
  });

  it('deve atualizar o estado do botão quando o texto muda', () => {
    const { result } = renderHook(() => useAnnotationForm());
    
    act(() => {
      result.current.handleTextChange('ab');
    });
    expect(result.current.isButtonEnabled).toBe(false);
    
    act(() => {
      result.current.handleTextChange('abcd');
    });
    expect(result.current.isButtonEnabled).toBe(true);
  });

  it('deve resetar o formulário corretamente', () => {
    const { result } = renderHook(() => useAnnotationForm());
    
    act(() => {
      result.current.handleTextChange('Teste');
    });
    
    act(() => {
      result.current.resetForm();
    });
    
    expect(result.current.annotation).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.showSuccessToast).toBe(false);
    expect(result.current.isButtonEnabled).toBe(false);
  });

  it('deve mostrar alerta quando tentar salvar sem anotação', async () => {
    const { result } = renderHook(() => useAnnotationForm());
    
    await act(async () => {
      await result.current.handleSave();
    });
    
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, digite uma anotação.');
  });

  it('deve mostrar alerta quando permissão de localização é negada', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
    
    const { result } = renderHook(() => useAnnotationForm());
    
    act(() => {
      result.current.handleTextChange('Teste');
    });
    
    await act(async () => {
      await result.current.handleSave();
    });
    
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Permissão para acessar a localização foi negada.');
  });

  it('deve salvar anotação com sucesso', async () => {
    const { result } = renderHook(() => useAnnotationForm());
    
    act(() => {
      result.current.handleTextChange('Teste');
    });
    
    await act(async () => {
      await result.current.handleSave();
    });
    
    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
    
    const { addAnnotation } = useAnnotations();
    expect(addAnnotation).toHaveBeenCalledWith({
      latitude: -15.7801,
      longitude: -47.9292,
      annotation: 'Teste',
      datetime: expect.any(String),
    });
    
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Success);
    
    expect(result.current.showSuccessToast).toBe(true);
    
    expect(result.current.annotation).toBe('');
  });

  it('deve lidar com erro ao salvar anotação', async () => {
    const addAnnotationMock = jest.fn().mockResolvedValue(false);
    (useAnnotations as jest.Mock).mockReturnValue({
      addAnnotation: addAnnotationMock,
      refreshAnnotations: jest.fn(),
    });
    
    const { result } = renderHook(() => useAnnotationForm());
    
    act(() => {
      result.current.handleTextChange('Teste');
    });
    
    await act(async () => {
      await result.current.handleSave();
    });
    
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    
    expect(result.current.showSuccessToast).toBe(false);
  });

  it('deve lidar com exceção ao salvar anotação', async () => {
    const addAnnotationMock = jest.fn().mockRejectedValue(new Error('Erro de teste'));
    (useAnnotations as jest.Mock).mockReturnValue({
      addAnnotation: addAnnotationMock,
      refreshAnnotations: jest.fn(),
    });
    
    const { result } = renderHook(() => useAnnotationForm());
    
    act(() => {
      result.current.handleTextChange('Teste');
    });
    
    await act(async () => {
      await result.current.handleSave();
    });
    
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Não foi possível salvar a anotação.');
  });
});