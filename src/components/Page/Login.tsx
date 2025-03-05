import axios from 'axios';
import Loader from '../Loader';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axiosInstance';
import { AlertCircle, LogIn, User, Lock, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Login = () => {
  const [userType, setUserType] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = userType === 'patient' ? '/patient/login' : '/hospital/login';

    try {
      const response = await axiosInstance.post(endpoint, { email, password });
      const data = response.data;

      if (data.Token) {
        localStorage.setItem('token', data.Token);
        toast.success('Login successful!');
        window.location.href = '/' + `${userType}` + '/home';
      } else {
        throw new Error('Token not received from API.');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message || 'An error occurred during login.'
        : (err as Error).message || 'An error occurred during login.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 mb-2">
            <LogIn className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">Login</span>
          </CardTitle>
          <CardDescription>Select your user type and enter your credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="userType" className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>User Type</span>
              </Label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent className="bg-black/100">
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="hospital">Hospital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center space-x-2 mb-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>Email</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="password" className="flex items-center space-x-2 mb-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span>Password</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
