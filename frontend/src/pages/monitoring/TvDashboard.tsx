import { useEffect } from 'react';
import { TvLayout } from '@/components/layout/TvLayout';
import { PatientGrid } from '@/components/patient/PatientGrid';
import { usePatientStore } from '@/store/usePatientStore';
import { socketService } from '@/services/socket/socketClient';

export default function TvDashboard() {
  const { patients, fetchPatients, addPatient, updatePatient, removePatient } = usePatientStore();

  useEffect(() => {
    fetchPatients();

    socketService.connect();

    socketService.on('patient-created', (data) => {
      addPatient(data);
    });

    socketService.on('patient-updated', (data) => {
      updatePatient(data);
    });

    socketService.on('patient-deleted', (data) => {
      removePatient(data.id);
    });

    return () => {
      socketService.off('patient-created');
      socketService.off('patient-updated');
      socketService.off('patient-deleted');
      socketService.disconnect();
    };
  }, [fetchPatients, addPatient, updatePatient, removePatient]);

  return (
    <TvLayout>
      <PatientGrid patients={patients} />
    </TvLayout>
  );
}
