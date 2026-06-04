import type { Patient } from '@/types/patient';
import { PatientRow } from './PatientRow';
import { AnimatePresence } from 'framer-motion';

interface PatientGridProps {
  patients: Patient[];
}

export const PatientGrid = ({ patients }: PatientGridProps) => {
  const displayPatients = patients.slice(0, 16);
  
  const col1 = displayPatients.slice(0, 8);
  const col2 = displayPatients.slice(8, 16);

  const fillEmpty = (col: Patient[]) => {
    const emptyCount = Math.max(0, 8 - col.length);
    return Array.from({ length: emptyCount }).map((_, i) => (
      <div key={`empty-${i}`} className="h-[10vh] min-h-[80px] w-full border-b border-[#222] bg-[#0d0d0d]/50" />
    ));
  };

  const TableHeader = ({ title }: { title: string }) => (
    <div className="flex flex-col border-b border-[#333]">
      <div className="h-12 bg-[#1A1A1A] flex items-center px-6 border-b border-[#333]">
        <span className="text-lg font-bold text-slate-300 uppercase tracking-widest">{title}</span>
      </div>
      <div className="h-14 bg-[#151515] flex px-4 items-center">
        <div className="flex-1 grid grid-cols-8 gap-4 text-slate-400 font-bold uppercase tracking-wider text-sm">
          <div className="col-span-2 pl-2">Patient</div>
          <div className="col-span-1">UHID</div>
          <div className="col-span-2">Department</div>
          <div className="col-span-1 text-center">Adm.</div>
          <div className="col-span-1 text-center">Days</div>
          <div className="col-span-1 text-right pr-2">Status</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full grid grid-cols-2 gap-6 p-2 bg-transparent">
      
      {/* Section A */}
      <div className="flex flex-col h-full bg-[#0d0d0d] rounded-xl overflow-hidden shadow-2xl border border-[#222]">
        <TableHeader title="Section A" />
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {col1.map((patient) => (
              <PatientRow key={patient.id} patient={patient} />
            ))}
          </AnimatePresence>
          {fillEmpty(col1)}
        </div>
      </div>

      {/* Section B */}
      <div className="flex flex-col h-full bg-[#0d0d0d] rounded-xl overflow-hidden shadow-2xl border border-[#222]">
        <TableHeader title="Section B" />
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {col2.map((patient) => (
              <PatientRow key={patient.id} patient={patient} />
            ))}
          </AnimatePresence>
          {fillEmpty(col2)}
        </div>
      </div>

    </div>
  );
};
