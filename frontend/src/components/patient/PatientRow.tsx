import type { Patient } from '@/types/patient';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PatientRowProps {
  patient: Patient;
}

const statusConfig = {
  'CRITICAL': 'bg-[#dc2626]', // red-600
  'HIGH RISK': 'bg-[#f97316]', // orange-500
  'ISOLATION': 'bg-[#0284c7]', // sky-600 (darker blue)
  'STABLE': 'bg-[#16a34a]', // green-600
};

const badgeConfig = {
  'CRITICAL': 'border-[#dc2626] text-[#dc2626]',
  'HIGH RISK': 'border-[#f97316] text-[#f97316]',
  'ISOLATION': 'border-[#0284c7] text-[#0284c7]',
  'STABLE': 'border-[#16a34a] text-[#16a34a]',
};

export const PatientRow = ({ patient }: PatientRowProps) => {
  const isCritical = patient.status === 'CRITICAL';

  // Format date to match image: YYYY-MM-DD
  const formattedDate = new Date(patient.admissionDate).toISOString().split('T')[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group relative flex min-h-[85px] w-full items-center bg-[#050505] hover:bg-[#111111] transition-colors border-b border-[#222] pl-6 pr-6 py-3"
    >
      {/* Left solid status bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-2", statusConfig[patient.status])} />
      
      {/* Content Grid (Matching Image layout: 5 logical columns without Bed) */}
      <div className="flex-1 grid grid-cols-12 gap-4 items-center h-full ml-4 min-w-0">
        
        {/* 1. Name & UHID (col-span-3) */}
        <div className="col-span-3 flex flex-col justify-center space-y-1 min-w-0">
          <h2 className="text-lg font-bold text-[#f1f5f9] truncate transition-colors leading-tight" title={patient.patientName}>
            {patient.patientName}
          </h2>
          <span className="text-xs font-mono text-[#64748b] truncate leading-tight" title={patient.uhid}>
            {patient.uhid}
          </span>
        </div>

        {/* 2. Date (col-span-2) */}
        <div className="col-span-2 flex items-center min-w-0">
          <span className="text-sm font-medium text-[#64748b] truncate">{formattedDate}</span>
        </div>

        {/* 3. Days (col-span-2) */}
        <div className="col-span-2 flex items-center min-w-0">
          <span className="text-xl font-bold text-[#f1f5f9]">{patient.days}</span>
          <span className="text-sm font-bold text-[#64748b] ml-1">d</span>
        </div>

        {/* 4. Diagnosis (col-span-3) */}
        <div className="col-span-3 flex items-center min-w-0 pr-2">
          <span className="text-sm font-medium text-[#94a3b8] line-clamp-2 leading-snug" title={patient.diagnosis}>
            {patient.diagnosis}
          </span>
        </div>

        {/* 5. Status Badge (col-span-2) */}
        <div className="col-span-2 flex items-center justify-end min-w-0">
          <motion.div 
            animate={isCritical ? { opacity: [1, 0.3, 1] } : {}}
            transition={isCritical ? { duration: 1.0, repeat: Infinity, ease: "easeInOut" } : {}}
            className={cn(
              "px-3 py-1 rounded-md border-[1.5px] text-[11px] font-bold tracking-widest uppercase truncate bg-transparent", 
              badgeConfig[patient.status]
            )}
            title={patient.status}
          >
            {patient.status}
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};
