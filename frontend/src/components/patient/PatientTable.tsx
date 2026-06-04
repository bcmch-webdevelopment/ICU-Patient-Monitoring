import type { Patient } from '@/types/patient';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';


interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
  onView: (patient: Patient) => void;
}

const alertConfig = {
  'CRITICAL': 'bg-red-100 text-red-700 border border-red-200',
  'HIGH RISK': 'bg-orange-100 text-orange-700 border border-orange-200',
  'ISOLATION': 'bg-cyan-100 text-cyan-700 border border-cyan-200',
  'STABLE': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

export const PatientTable = ({ patients, onEdit, onDelete, onView }: PatientTableProps) => {
  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50 sticky top-0">
          <TableRow>
            <TableHead className="font-semibold text-slate-700">Patient Name</TableHead>
            <TableHead className="font-semibold text-slate-700">UHID</TableHead>
            <TableHead className="font-semibold text-slate-700">Department</TableHead>
            <TableHead className="font-semibold text-slate-700">Admission Date</TableHead>
            <TableHead className="font-semibold text-slate-700">Days</TableHead>
            <TableHead className="font-semibold text-slate-700">Diagnosis</TableHead>
            <TableHead className="font-semibold text-slate-700">Alert Status</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} className="hover:bg-slate-50 transition-colors">
              <TableCell className="font-medium text-slate-900">{patient.patientName}</TableCell>
              <TableCell className="text-slate-500 font-mono text-sm">{patient.uhid}</TableCell>
              <TableCell className="text-slate-600">{patient.department}</TableCell>
              <TableCell className="text-slate-600">
                {new Date(patient.admissionDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-slate-600">{patient.days}</TableCell>
              <TableCell className="text-slate-600 max-w-[200px] truncate" title={patient.diagnosis}>
                {patient.diagnosis}
              </TableCell>
              <TableCell>
                <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", alertConfig[patient.status])}>
                  {patient.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onView(patient)} className="h-8 w-8 text-brand hover:text-[#9a151c] hover:bg-red-50">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(patient)} className="h-8 w-8 text-slate-600 hover:text-slate-700 hover:bg-slate-100">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(patient.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {patients.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                No patients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
