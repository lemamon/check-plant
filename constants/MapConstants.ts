/**
 * Constantes relacionadas ao mapa e anotações
 */

export const DEFAULT_MAP_REGION = {
  latitude: -15.7801,
  longitude: -47.9292,
  latitudeDelta: 25,
  longitudeDelta: 25,
};

export const ANNOTATION_CONSTANTS = {
  OFFSET_BASE: 0.0002,
  PROXIMITY_THRESHOLD: 0.00001,
  ANGLE_INCREMENT: 30,
  POINTS_PER_REVOLUTION: 12,
};

export const ANNOTATION_STYLES = {
  MARKER_COLORS: {
    SYNCED: 'gray',
    NOT_SYNCED: 'green',
  },
  CALLOUT: {
    WIDTH: 200,
    PADDING: 10,
    BORDER_RADIUS: 5,
  },
  ADJUSTED_LOCATION_TEXT: {
    FONT_SIZE: 12,
    MARGIN_TOP: 5,
    COLOR: '#FF9800',
  },
};

export const ANNOTATION_TEXTS = {
  SYNCED_STATUS: 'Sincronizado',
  NOT_SYNCED_STATUS: 'Não sincronizado',
  ADJUSTED_POSITION_WARNING: '⚠️ Posição ajustada para melhor visualização',
};