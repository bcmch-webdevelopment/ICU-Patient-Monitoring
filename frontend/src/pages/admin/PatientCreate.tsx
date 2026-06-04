import { AdminLayout } from '@/components/layout/AdminLayout';
import { PatientForm } from '@/components/patient/PatientForm';
import { patientApi } from '@/services/api/patientApi';
import { usePatientStore } from '@/store/usePatientStore';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PatientCreate() {
  const navigate = useNavigate();
  const { addPatient } = usePatientStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const newPatient = await patientApi.createPatient(data);
      addPatient(newPatient);
      toast({ title: 'Success', description: 'Patient added successfully.' });
      navigate('/admin/patients');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create patient.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Add New Patient</h1>
            <p className="text-slate-500 mt-1">Register a new patient into the ICU monitoring system</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <PatientForm onSubmit={handleSubmit} onCancel={() => navigate(-1)} isLoading={isSubmitting} />
        </div>
      </div>
    </AdminLayout>
  );
}
