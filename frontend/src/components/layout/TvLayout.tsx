import { useEffect, useState } from 'react';
 import hospitalLogo from "../../assets/bcmch-logo.png"
 ;

export const TvLayout = ({ children }: { children: React.ReactNode }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-[#111111] border-b border-[#222222] shadow-md relative z-10">
      <div className="flex items-center gap-3">
      <img
      src={hospitalLogo}
      alt="Believers Church Medical College Hospital"
      className="h-14 w-auto"
      />
  </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-widest text-slate-200">Patient Monitoring</h1>
        </div>
        
        <div className="flex flex-col items-end text-right">
          <span className="text-3xl font-mono text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </span>
          <span className="text-sm font-medium text-slate-400">
            {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full h-[calc(100vh-80px)] p-4 relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};
