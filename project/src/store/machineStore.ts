import { create } from 'zustand';
import { Machine } from '../types';
import { supabase } from '../lib/supabase';

interface MachineStore {
  machines: Machine[];
  loading: boolean;
  error: string | null;
  selectedCompanyId: string | null;
  fetchMachines: (companyId: string) => Promise<void>;
  updateMachine: (machine: Partial<Machine> & { id: string }) => Promise<void>;
  addMachine: (machine: Omit<Machine, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

// Sample data for development
const sampleMachines: Machine[] = [
  {
    id: '1',
    company_id: 'sample-company',
    name: 'Máquina de Corte A',
    status: 'running',
    progress: 75,
    next_product: 'Peça XYZ-123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    company_id: 'sample-company',
    name: 'Prensa Hidráulica B',
    status: 'maintenance',
    progress: 30,
    next_product: 'Componente ABC-456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    company_id: 'sample-company',
    name: 'Torno CNC C',
    status: 'idle',
    progress: 0,
    next_product: 'Peça DEF-789',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    company_id: 'sample-company',
    name: 'Fresadora D',
    status: 'error',
    progress: 45,
    next_product: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useMachineStore = create<MachineStore>((set, get) => ({
  machines: sampleMachines, // Initialize with sample data
  loading: false,
  error: null,
  selectedCompanyId: 'sample-company',

  fetchMachines: async (companyId: string) => {
    set({ loading: true, error: null });
    try {
      // For development, use sample data instead of Supabase
      set({ machines: sampleMachines, selectedCompanyId: companyId });
      
      // Commented out Supabase call for now
      /*const { data, error } = await supabase
        .from('machines')
        .select('*')
        .eq('company_id', companyId);

      if (error) throw error;
      set({ machines: data, selectedCompanyId: companyId });*/
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateMachine: async (machine) => {
    try {
      // For development, update local state only
      set((state) => ({
        machines: state.machines.map((m) =>
          m.id === machine.id ? { ...m, ...machine } : m
        ),
      }));

      // Commented out Supabase call for now
      /*const { error } = await supabase
        .from('machines')
        .update({
          ...machine,
          updated_at: new Date().toISOString(),
        })
        .eq('id', machine.id);

      if (error) throw error;*/
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  addMachine: async (machine) => {
    try {
      // For development, add to local state only
      const newMachine: Machine = {
        id: Math.random().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...machine,
      };

      set((state) => ({
        machines: [...state.machines, newMachine],
      }));

      // Commented out Supabase call for now
      /*const { data, error } = await supabase
        .from('machines')
        .insert([machine])
        .select()
        .single();

      if (error) throw error;*/
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));