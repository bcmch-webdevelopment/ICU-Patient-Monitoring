import axios from 'axios';
import type { Patient } from '@/types/patient';

const API_URL = 'http://localhost:5000/api';

export const patientApi = {
  getPatients: async (): Promise<Patient[]> => {
    const response = await axios.get(`${API_URL}/patients`);
    return response.data;
  },
  
  getPatientById: async (id: string): Promise<Patient> => {
    const response = await axios.get(`${API_URL}/patients/${id}`);
    return response.data;
  },

  createPatient: async (patient: Omit<Patient, 'id'>): Promise<Patient> => {
    const response = await axios.post(`${API_URL}/patients`, patient);
    return response.data;
  },

  updatePatient: async (id: string, patient: Partial<Patient>): Promise<Patient> => {
    const response = await axios.put(`${API_URL}/patients/${id}`, patient);
    return response.data;
  },

  deletePatient: async (id: string): Promise<Patient> => {
    const response = await axios.delete(`${API_URL}/patients/${id}`);
    return response.data;
  }
};
