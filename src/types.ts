export type Place = 'Abierto' | 'Cerrado';
export type Area = 'Danza' | 'Música' | 'Teatro' | 'Artes Visuales' | 'Literatura' | 'Cine';
export type Municipality = string;

export interface AttendanceRecord {
  id: string;
  timestamp: number;
  place: Place;
  subPlace?: string;
  area: Area;
  municipality: Municipality;
  count: number;
}

export interface FilterState {
  place: Place;
  subPlace?: string;
  area: Area;
  municipality: Municipality;
}
