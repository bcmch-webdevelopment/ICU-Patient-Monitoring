import { AdminLayout } from '@/components/layout/AdminLayout';
import { PatientTable } from '@/components/patient/PatientTable';
import { usePatientStore } from '@/store/usePatientStore';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { patientApi } from '@/services/api/patientApi';
import { toast } from '@/hooks/use-toast';

export default function PatientsList() {
  const { patients, fetchPatients, removePatient } = usePatientStore();
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientApi.deletePatient(id);
        removePatient(id);
        toast({ title: 'Success', description: 'Patient deleted successfully.' });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete patient.', variant: 'destructive' });
      }
    }
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.patientName.toLowerCase().includes(search.toLowerCase()) || p.uhid.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || p.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Patients</h1>
            <p className="text-slate-500 mt-1">Manage hospital ICU patients</p>
          </div>
          <Button onClick={() => navigate('/admin/patients/new')} className="bg-brand hover:bg-[#9a151c]">
            <Plus className="w-4 h-4 mr-2" /> Add Patient
          </Button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by Name or UHID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200 w-full"
            />
          </div>
          
          <div className="w-full sm:w-[200px] flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Departments</SelectItem>
                <SelectItem value="ICU">ICU</SelectItem>
                <SelectItem value="CCU">CCU</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="Neurology">Neurology</SelectItem>
                <SelectItem value="Cardiology">Cardiology</SelectItem>
                <SelectItem value="General Ward">General Ward</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <PatientTable 
          patients={filteredPatients}
          onEdit={(p) => navigate(`/admin/patients/edit/${p.id}`)}
          onDelete={handleDelete}
          onView={(p) => navigate(`/admin/patients/view/${p.id}`)}
        />
      </div>
    </AdminLayout>
  );
}
