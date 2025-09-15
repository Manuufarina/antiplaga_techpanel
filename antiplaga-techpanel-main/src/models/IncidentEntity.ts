export interface IncidentComment {
  id: number;
  user: string;
  comment: string;
  created_at: string;
  files?: IncidentFile[];
}

export interface IncidentFile {
  id: number;
  incident_comment_id: number;
  path: string;
  created_at: string;
}

export type IncidentStatus = 'pendiente' | 'en_proceso' | 'solucionado' | 'rechazado';

export interface IncidentEntity {
  id: number;
  title: string;
  description: string;
  location: string;
  photo_url?: string;
  status: IncidentStatus;
  created_at: string;
  updated_at: string;
  technician: number; // id del técnico asignado
  client: string;
  comments: IncidentComment[];
  products_used?: string;
  solution?: string;
  photos?: string[];
} 