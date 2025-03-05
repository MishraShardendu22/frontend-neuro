/* eslint-disable @typescript-eslint/no-explicit-any */
import Loader from '@/components/Loader';
import { Navigate } from 'react-router-dom';
import axiosInstance from '@/lib/axiosInstance';
import { useUserStore } from '@/components/store/userStore';
import React, { ReactNode, useEffect, useState } from 'react';

interface UnprotectedRoutesProps {
  children: ReactNode;
}

const UnprotectedRoutes: React.FC<UnprotectedRoutesProps> = ({ children }) => {
  const user = useUserStore((state: any) => state.user);
  const setUser = useUserStore((state: any) => state.setUser);
  const [rateLimited, setRateLimited] = useState<boolean>(false);
  const [isUnauthenticated, setIsUnauthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');
      console.log('Stored Token:', token);

      if (!token) {
        if (isMounted) setIsUnauthenticated(true);
        return;
      }

      let authenticatedUser = null;

      try {
        const hospitalResponse = await axiosInstance.get('/hospital/verifyHospital', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (hospitalResponse.status === 200 && isMounted) {
          authenticatedUser = hospitalResponse.data.Data;
          console.log('Authenticated Hospital:', authenticatedUser);
        }
      } catch (error: any) {
        if (error.response?.status === 429) {
          setRateLimited(true);
          return;
        }
      }

      if (!authenticatedUser) {
        try {
          const patientResponse = await axiosInstance.get('/patient/verifyPatient', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (patientResponse.status === 200 && isMounted) {
            authenticatedUser = patientResponse.data.Data;
            console.log('Authenticated Patient:', authenticatedUser);
          }
        } catch (error: any) {
          if (error.response?.status === 429) {
            setRateLimited(true);
            return;
          }
        }
      }

      if (authenticatedUser) {
        setUser(authenticatedUser);
        setIsUnauthenticated(false);
      } else {
        setIsUnauthenticated(true);
      }
    };

    checkAuthentication();

    return () => {
      isMounted = false;
    };
  }, [setUser]);

  if (rateLimited) {
    return <Navigate to="/too-fast" />;
  }

  if (isUnauthenticated === null) {
    return <Loader />;
  }

  if (!isUnauthenticated) {
    return <Navigate to={user?.role === 'Hospital' ? '/hospital/home' : '/patient/home'} />;
  }

  return <>{children}</>;
};

export default UnprotectedRoutes;
