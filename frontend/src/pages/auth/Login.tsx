import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, User } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import hospitalBg from "../../assets/hospital-bg.png";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userProfile = await response.json();
        login(userProfile, false);
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        const errorData = await response.json();
        toast({
          title: 'Authentication Failed',
          description: errorData.message || 'Invalid credentials.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: 'Could not connect to the server.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Branding Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img src={hospitalBg} alt="Hospital" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#b71a22] via-[#b71a22]/70 to-transparent/20" />
        </div>
        
        <div className="relative z-10 p-12 flex-1 flex flex-col justify-end text-white pb-24">
           <h1 className="text-5xl font-bold mb-6 tracking-tight">Welcome to<br/>Believers Hospital</h1>
           <p className="text-xl text-white/90 max-w-md leading-relaxed">
             We are committed to providing exceptional healthcare with compassion, innovation and excellence.
           </p>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-slate-100">
           <div className="text-center mb-10">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#b71a22]">
                 <User className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
              <p className="text-slate-500 mt-2">Login to your account to continue</p>
           </div>
           
           <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                 <Label htmlFor="username" className="text-slate-700 font-medium">Username</Label>
                 <Input 
                   id="username" 
                   type="text" 
                   placeholder="Enter your username" 
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-[#b71a22]"
                   required 
                 />
              </div>
              
              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                    <a href="#" className="text-sm text-[#b71a22] font-medium hover:underline">Forgot Password?</a>
                 </div>
                 <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter your password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 bg-slate-50 border-slate-200 pr-10 focus-visible:ring-[#b71a22]"
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                 </div>
              </div>
              
              <Button type="submit" className="w-full h-12 text-base font-semibold bg-[#b71a22] hover:bg-[#9a151c] text-white shadow-lg shadow-red-500/20 transition-all rounded-xl mt-8">
                 Login
              </Button>

              <div className="text-center mt-6">
                 <p className="text-sm text-slate-600">
                    <Link to="/admin/registration" className="text-[#b71a22] hover:underline font-medium">
                       Click here for registration
                    </Link>
                 </p>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
}
