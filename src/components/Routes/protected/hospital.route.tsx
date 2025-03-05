/* eslint-disable @typescript-eslint/no-explicit-any */
import Loader from '@/components/Loader';
import axiosInstance from '@/lib/axiosInstance';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/components/store/userStore';
import React, { ReactNode, useEffect, useState } from 'react';

interface ProtectedHospitalProps {
  children: ReactNode;
}

const ProtectedHospital: React.FC<ProtectedHospitalProps> = ({ children }) => {
  const navigate = useNavigate();
  const setUser = useUserStore((state: any) => state.setUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        if (isMounted) setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axiosInstance.get('/hospital/verifyHospital', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!isMounted) return;

        if (response.status === 200) {
          setUser(response.data.Data);
          setIsAuthenticated(true);
        } else if (response.status === 429) {
          navigate('/too-fast');
        } else {
          setIsAuthenticated(false);
        }
      } catch (error: any) {
        console.error('Authentication check failed:', error);
        if (isMounted) setIsAuthenticated(false);
      }
    };

    checkAuthentication();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuthenticated === null) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedHospital;
