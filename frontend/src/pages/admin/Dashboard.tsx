import { AdminLayout } from '@/components/layout/AdminLayout';
import { usePatientStore } from '@/store/usePatientStore';
import { useEffect } from 'react';
import { Users, AlertCircle, ShieldAlert, Activity } from 'lucide-react';

export default function Dashboard() {
  const { patients, fetchPatients } = usePatientStore();

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const stats = [
    { name: 'Total Patients', value: patients.length, icon: Users, color: 'text-brand', bg: 'bg-red-100' },
    { name: 'Critical', value: patients.filter(p => p.status === 'CRITICAL').length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { name: 'High Risk', value: patients.filter(p => p.status === 'HIGH RISK').length, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Isolation', value: patients.filter(p => p.status === 'ISOLATION').length, icon: ShieldAlert, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of ICU patient status.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h2>
          <div className="text-slate-500 text-sm">
            No recent activity recorded yet.
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
