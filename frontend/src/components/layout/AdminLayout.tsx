import { Link, useLocation, useNavigate } from 'react-router-dom';
 import hospitalLogo from "../../assets/bcmch-logo.png";
import { LayoutDashboard, Users, PlusCircle, Settings, LogOut, Bell, User as UserIcon, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Patients', href: '/admin/patients', icon: Users },
    { name: 'Add Patient', href: '/admin/patients/new', icon: PlusCircle },
    { name: 'User Management', href: '/admin/users', icon: UserPlus },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col shadow-sm hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          
          <span className="font-bold text-lg text-slate-800">Believers Hospital</span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-red-50 text-brand" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-brand" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5 text-slate-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
          <div className="md:hidden font-bold text-lg text-slate-800">Believers Hospital</div>
          <div className="hidden md:block text-slate-600 font-medium">Patient Control System</div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-brand transition-colors">
                        {user?.fullName || 'Admin User'}
                      </p>
                      <p className="text-xs text-slate-500">{user?.designation || 'Administrator'}</p>
                    </div>
                    <Avatar className="h-9 w-9 border border-slate-200">
                      <AvatarImage src="" alt={user?.fullName || 'Avatar'} />
                      <AvatarFallback className="bg-red-100 text-brand font-medium">
                        {user?.fullName?.charAt(0) || <UserIcon className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
