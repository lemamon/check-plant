export interface Annotation {
  latitude: number;
  longitude: number;
  annotation: string;
  datetime: string;
  synced?: boolean;
}

export interface ApiResponse {
  attempt?: string;
  id?: string;
  request_id?: string;
  status: string;
  data?: Annotation[];
  error?: string;
}