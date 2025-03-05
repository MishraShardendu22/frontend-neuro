import Loader from '../Loader';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import axiosInstance from '@/lib/axiosInstance';

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

  const handleRegister = async (e: { preventDefault: () => void }) => {
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
      window.location.href = '/login';
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
    <div
      style={{
        maxWidth: '400px',
        margin: '2rem auto',
        padding: '1rem',
        border: '1px solid #ccc',
      }}
    >
      <h2 style={{ textAlign: 'center' }}>Register</h2>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="userType" style={{ display: 'block', marginBottom: '0.5rem' }}>
            User Type
          </label>
          <select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option className="bg-black/100" value="patient">
              Patient
            </option>
            <option className="bg-black/100" value="hospital">
              Hospital
            </option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="fullName" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="text"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        {userType === 'patient' && (
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="gender" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        )}

        {userType === 'hospital' && (
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="address" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Address
            </label>
            <textarea
              id="address"
              placeholder="Enter hospital address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
              required
            ></textarea>
          </div>
        )}

        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        {message && <div style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Processing...' : 'Register'}
        </Button>
      </form>
    </div>
  );
};

export default Register;
