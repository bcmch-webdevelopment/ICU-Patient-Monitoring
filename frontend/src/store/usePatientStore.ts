import { create } from 'zustand';
import type { Patient } from '@/types/patient';
import { patientApi } from '@/services/api/patientApi';

interface PatientStore {
  patients: Patient[];
  isLoading: boolean;
  error: string | null;
  
  fetchPatients: () => Promise<void>;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  removePatient: (id: string) => void;
  setPatients: (patients: Patient[]) => void;
}

export const usePatientStore = create<PatientStore>((set) => ({
  patients: [],
  isLoading: false,
  error: null,

  fetchPatients: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await patientApi.getPatients();
      set({ patients: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch patients', isLoading: false });
    }
  },

  addPatient: (patient) => 
    set((state) => {
      if (state.patients.find((p) => p.id === patient.id)) return state;
      return { patients: [...state.patients, patient] };
    }),

  updatePatient: (patient) =>
    set((state) => ({
      patients: state.patients.map((p) => (p.id === patient.id ? patient : p)),
    })),

  removePatient: (id) =>
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
    })),

  setPatients: (patients) => set({ patients }),
}));
