import Loader from '../Loader';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axiosInstance';
import { AlertCircle, User, Lock, Mail, Phone, MapPin } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Register = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Male');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userType, setUserType] = useState('patient');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const endpoint = userType === 'patient' ? '/patient/register' : '/hospital/register';

    const payload = {
      fullName,
      email,
      password,
      phoneNumber,
      ...(userType === 'patient' ? { gender } : { address }),
    };

    try {
      const response = await axiosInstance.post(endpoint, payload);
      console.log('Registration success:', response.data);
      setMessage('Registration successful. Please proceed to login.');
      toast.success('Registration successful. Please proceed to login.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed.');
      toast.error('Registration Error.');
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
            <User className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">Register</span>
          </CardTitle>
          <CardDescription>Select your user type and enter your details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
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
              <Label htmlFor="fullName" className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Full Name</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
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
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="flex items-center space-x-2 mb-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>Phone Number</span>
              </Label>
              <Input
                id="phoneNumber"
                type="text"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            {userType === 'patient' && (
              <div>
                <Label htmlFor="gender" className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>Gender</span>
                </Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/100">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {userType === 'hospital' && (
              <div>
                <Label htmlFor="address" className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>Address</span>
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter hospital address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert variant="default">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;