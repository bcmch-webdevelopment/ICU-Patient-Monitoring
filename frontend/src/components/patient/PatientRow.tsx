import type { Patient } from '@/types/patient';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PatientRowProps {
  patient: Patient;
}

const statusConfig = {
  'CRITICAL': 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] border-red-500',
  'HIGH RISK': 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)] border-orange-500',
  'ISOLATION': 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] border-cyan-500',
  'STABLE': 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] border-emerald-500',
};

const textStatusConfig = {
  'CRITICAL': 'text-red-400',
  'HIGH RISK': 'text-orange-400',
  'ISOLATION': 'text-cyan-400',
  'STABLE': 'text-emerald-400',
};

export const PatientRow = ({ patient }: PatientRowProps) => {
  const isCritical = patient.status === 'CRITICAL';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group relative flex min-h-[10vh] w-full items-center bg-[#111111]/80 hover:bg-[#1A1A1A] transition-colors border-b border-[#222] pl-1 pr-4 py-2"
    >
      {/* Left glowing status bar */}
      <motion.div 
        animate={isCritical ? { opacity: [0.6, 1, 0.6] } : {}}
        transition={isCritical ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : {}}
        className={cn("absolute left-0 top-0 bottom-0 w-1.5 rounded-r-md", statusConfig[patient.status])}
      />
      
      {/* Content Grid (8 Columns) */}
      <div className="flex-1 grid grid-cols-8 gap-4 items-center h-full ml-4 min-w-0">
        
        {/* 1. Name & Diagnosis (col-span-2) */}
        <div className="col-span-2 flex flex-col justify-center space-y-0.5 pl-2 min-w-0">
          <h2 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors line-clamp-2 leading-tight" title={patient.patientName}>
            {patient.patientName}
          </h2>
          <span className="text-sm font-medium text-slate-400 line-clamp-2 leading-tight" title={patient.diagnosis}>
            {patient.diagnosis}
          </span>
        </div>

        {/* 2. UHID (col-span-1) */}
        <div className="col-span-1 flex items-center min-w-0">
          <span className="text-lg font-mono text-slate-300 truncate">{patient.uhid}</span>
        </div>

        {/* 3. Department (col-span-2) */}
        <div className="col-span-2 flex items-center min-w-0">
          <span className="text-lg font-medium text-slate-300 line-clamp-2 leading-tight">{patient.department}</span>
        </div>

        {/* 4. Admission Date (col-span-1) */}
        <div className="col-span-1 flex items-center justify-center text-center min-w-0">
          <span className="text-lg text-slate-300 truncate">
            {new Date(patient.admissionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* 5. Days (col-span-1) */}
        <div className="col-span-1 flex items-center justify-center text-center min-w-0">
          <span className="text-lg font-semibold text-slate-300 truncate">
            {patient.days} {patient.days === 1 ? 'Day' : 'Days'}
          </span>
        </div>

        {/* 6. Status (col-span-1) */}
        <div className="col-span-1 flex items-center justify-end pr-1 min-w-0">
          <span className={cn("text-lg font-bold tracking-wider uppercase text-right truncate", textStatusConfig[patient.status])}>
            {patient.status}
          </span>
        </div>

      </div>
    </motion.div>
  );
};
