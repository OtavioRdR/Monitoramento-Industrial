export interface Company {
  id: string;
  name: string;
  created_at: string;
}

export interface Machine {
  id: string;
  company_id: string;
  name: string;
  status: 'idle' | 'running' | 'maintenance' | 'error';
  progress: number;
  next_product: string | null;
  created_at: string;
  updated_at: string;
}

export type ChartType = 'pie' | 'bar' | 'line';