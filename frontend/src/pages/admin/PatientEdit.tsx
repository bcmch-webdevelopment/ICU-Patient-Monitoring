import { AdminLayout } from '@/components/layout/AdminLayout';
import { PatientForm } from '@/components/patient/PatientForm';
import { patientApi } from '@/services/api/patientApi';
import { usePatientStore } from '@/store/usePatientStore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Patient } from '@/types/patient';

export default function PatientEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updatePatient, patients } = usePatientStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const existingPatient = patients.find(p => p.id === id);
    if (existingPatient) {
      setPatient(existingPatient);
    } else if (id) {
      patientApi.getPatientById(id).then(setPatient).catch(() => {
        toast({ title: 'Error', description: 'Patient not found', variant: 'destructive' });
        navigate('/admin/patients');
      });
    }
  }, [id, patients, navigate]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const updated = await patientApi.updatePatient(id, data);
      updatePatient(updated);
      toast({ title: 'Success', description: 'Patient updated successfully.' });
      navigate('/admin/patients');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update patient.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!patient) {
    return <AdminLayout><div className="p-8 text-center">Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Edit Patient</h1>
            <p className="text-slate-500 mt-1">Update patient information</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <PatientForm initialData={patient} onSubmit={handleSubmit} onCancel={() => navigate(-1)} isLoading={isSubmitting} />
        </div>
      </div>
    </AdminLayout>
  );
}
