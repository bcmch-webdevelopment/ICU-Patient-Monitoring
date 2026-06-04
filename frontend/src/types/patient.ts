export interface Patient {
  id: string;
  patientName: string;
  uhid: string;
  department: string;
  admissionDate: string;
  days: number;
  diagnosis: string;
  status: 'CRITICAL' | 'HIGH RISK' | 'ISOLATION' | 'STABLE';
}
