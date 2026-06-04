import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
        login(userProfile, rememberMe);
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl overflow-hidden border-slate-100">
        <div className="bg-brand p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white mx-auto flex items-center justify-center text-3xl font-bold text-brand shadow-lg mb-4">
            +
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Believers Hospital</h1>
          <p className="text-red-100 mt-2 font-medium">Admin Control System</p>
        </div>
        
        <CardContent className="p-8 pb-4">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Enter your username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-brand hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center">
              <input 
                id="remember" 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand" 
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-slate-700 cursor-pointer">
                Remember me
              </label>
            </div>
            
            <Button type="submit" className="w-full bg-brand hover:bg-[#9a151c] text-white shadow-md transition-all">
              Login
            </Button>

            <div className="text-center mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <a href="/admin/registration" className="text-brand hover:underline font-medium" onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin/registration');
                }}>
                  Register here
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
