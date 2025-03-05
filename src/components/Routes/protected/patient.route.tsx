/* eslint-disable @typescript-eslint/no-explicit-any */
import Loader from '@/components/Loader';
import { Navigate } from 'react-router-dom';
import axiosInstance from '@/lib/axiosInstance';
import { useUserStore } from '@/components/store/userStore';
import React, { ReactNode, useEffect, useState } from 'react';

interface ProtectedPatientProps {
  children: ReactNode;
}

const ProtectedPatient: React.FC<ProtectedPatientProps> = ({ children }) => {
  const setUser = useUserStore((state: any) => state.setUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');
      console.log('The Token is:', token);

      if (!token) {
        if (isMounted) setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axiosInstance.get('/patient/verifyPatient', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('The response is:', response);

        if (!isMounted) return;

        if (response.status === 200) {
          setUser(response.data.Data);
          setIsAuthenticated(true);
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

export default ProtectedPatient;
