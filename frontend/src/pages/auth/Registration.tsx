import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import hospitalBg from "../../assets/hospital-bg.png";

export default function Registration() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [status, setStatus] = useState('Active');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, username, password, designation, status }),
      });

      if (response.ok) {
        toast({
          title: 'Registration Successful',
          description: 'You can now log in with your new account.',
        });
        navigate('/admin/login');
      } else {
        const errorData = await response.json();
        toast({
          title: 'Registration Failed',
          description: errorData.message || 'Something went wrong.',
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

  const isFormValid = fullName && username && password && confirmPassword && designation && status && (password === confirmPassword);

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
             Join Believers Hospital and create your account to securely manage patient records.
           </p>
        </div>
      </div>

      {/* Right Registration Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-slate-100 my-8">
           <div className="text-center mb-10">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#b71a22]">
                 <UserPlus className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
              <p className="text-slate-500 mt-2">Join Believers Hospital</p>
           </div>
           
           <form onSubmit={handleRegister} className="space-y-4">
              
              <div className="space-y-2">
                 <Label htmlFor="fullName" className="text-slate-700 font-medium">Full Name</Label>
                 <Input 
                   id="fullName" 
                   type="text" 
                   placeholder="Enter full name" 
                   value={fullName}
                   onChange={(e) => setFullName(e.target.value)}
                   className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-[#b71a22]"
                   required 
                 />
              </div>

              <div className="space-y-2">
                 <Label htmlFor="username" className="text-slate-700 font-medium">Username</Label>
                 <Input 
                   id="username" 
                   type="text" 
                   placeholder="Choose a username" 
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-[#b71a22]"
                   required 
                 />
              </div>

              <div className="space-y-2">
                 <Label htmlFor="designation" className="text-slate-700 font-medium">Designation</Label>
                 <Select onValueChange={setDesignation} required>
                   <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:ring-[#b71a22]">
                     <SelectValue placeholder="Select designation" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="Administrator">Administrator</SelectItem>
                     <SelectItem value="Doctor">Doctor</SelectItem>
                     <SelectItem value="Nurse">Nurse</SelectItem>
                     <SelectItem value="Technician">Technician</SelectItem>
                     <SelectItem value="Receptionist">Receptionist</SelectItem>
                     <SelectItem value="Staff">Staff</SelectItem>
                   </SelectContent>
                 </Select>
              </div>
              
              <div className="space-y-2">
                 <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                 <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Create a password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 bg-slate-50 border-slate-200 pr-10 focus-visible:ring-[#b71a22]"
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                 </div>
              </div>

              <div className="space-y-2">
                 <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm Password</Label>
                 <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Confirm password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 bg-slate-50 border-slate-200 pr-10 focus-visible:ring-[#b71a22]"
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                 </div>
                 {confirmPassword && password !== confirmPassword && (
                    <p className="text-sm text-red-500 font-medium">Passwords do not match</p>
                 )}
              </div>
              
              <div className="pt-4 flex gap-3">
                 <Button 
                   type="button" 
                   variant="outline" 
                   className="w-1/3 h-11 border-slate-200 text-slate-600"
                   onClick={() => {
                     setFullName('');
                     setUsername('');
                     setPassword('');
                     setConfirmPassword('');
                     setDesignation('');
                     setStatus('Active');
                   }}
                 >
                   Reset
                 </Button>
                 <Button 
                   type="submit" 
                   className="w-2/3 h-11 text-base font-semibold bg-[#b71a22] hover:bg-[#9a151c] text-white shadow-lg shadow-red-500/20 transition-all rounded-xl disabled:opacity-50"
                   disabled={!isFormValid}
                 >
                   Register
                 </Button>
              </div>

              <div className="text-center mt-6">
                 <p className="text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/admin/login" className="text-[#b71a22] hover:underline font-medium">
                       Login here
                    </Link>
                 </p>
              </div>
              
           </form>
        </div>
      </div>
    </div>
  );
}
