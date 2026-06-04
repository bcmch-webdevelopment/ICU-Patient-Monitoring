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
      <div key={`empty-${i}`} className="h-[85px] w-full border-b border-[#222] bg-transparent" />
    ));
  };

  return (
    <div className="w-full h-full grid grid-cols-2 gap-4 p-4 bg-black">
      
      {/* Section A */}
      <div className="flex flex-col h-full bg-[#0a0a0a] rounded-lg border border-[#222] overflow-hidden">
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
      <div className="flex flex-col h-full bg-[#0a0a0a] rounded-lg border border-[#222] overflow-hidden">
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
