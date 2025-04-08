import { renderHook } from '@testing-library/react-hooks';
import { useThemeColor } from '../useThemeColor';
import { useColorScheme } from '../useColorScheme';
import { Colors } from '@/constants/Colors';

jest.mock('../useColorScheme', () => ({
  useColorScheme: jest.fn(),
}));

jest.mock('@/constants/Colors', () => ({
  Colors: {
    light: {
      text: '#000',
      background: '#fff',
      tint: '#2f95dc',
      tabIconDefault: '#ccc',
      tabIconSelected: '#2f95dc',
    },
    dark: {
      text: '#fff',
      background: '#000',
      tint: '#fff',
      tabIconDefault: '#ccc',
      tabIconSelected: '#fff',
    },
  },
}));

describe('useThemeColor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useColorScheme as jest.Mock).mockReturnValue('light');
  });

  it('deve retornar a cor do tema light quando o tema é light', () => {
    const { result } = renderHook(() => useThemeColor({}, 'text'));
    
    expect(result.current).toBe(Colors.light.text);
  });

  it('deve retornar a cor do tema dark quando o tema é dark', () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    
    const { result } = renderHook(() => useThemeColor({}, 'text'));
    
    expect(result.current).toBe(Colors.dark.text);
  });

  it('deve usar o tema light como fallback quando o tema é null', () => {
    (useColorScheme as jest.Mock).mockReturnValue(null);
    
    const { result } = renderHook(() => useThemeColor({}, 'text'));
    
    expect(result.current).toBe(Colors.light.text);
  });

  it('deve priorizar as cores fornecidas via props', () => {
    const customColors = {
      light: '#ff0000',
      dark: '#00ff00',
    };
    
    const { result } = renderHook(() => useThemeColor(customColors, 'text'));
    
    expect(result.current).toBe(customColors.light);
    
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    
    const { result: darkResult } = renderHook(() => useThemeColor(customColors, 'text'));
    
    expect(darkResult.current).toBe(customColors.dark);
  });
});