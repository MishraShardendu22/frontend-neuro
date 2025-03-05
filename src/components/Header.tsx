/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/components/store/userStore';
import { LogOut, UserIcon, HistoryIcon, FilePlusIcon, HeartPulseIcon } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore((state: any) => state.user);
  const resetUser = useUserStore((state: any) => state.resetUser);
  const userRole: 'patient' | 'hospital' = user?.role?.toLowerCase() as 'patient' | 'hospital' || '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    resetUser();
    navigate('/login');
  };

  const navButtons = {
    patient: [
      { label: 'Profile', icon: UserIcon, path: '/patient/profile' },
      { label: 'History', icon: HistoryIcon, path: '/patient/history' },
    ],
    hospital: [
      { label: 'History', icon: HistoryIcon, path: '/hospital/history' },
      { label: 'New Cases', icon: FilePlusIcon, path: '/hospital/cases' },
      { label: 'Guidelines', icon: HeartPulseIcon, path: '/hospital/guidelines' },
    ],
  };

  return (
    <header className="flex items-center justify-between p-4 bg-background text-foreground shadow-sm">
      <Button
        variant="ghost"
        className="text-xl font-bold hover:bg-muted"
        onClick={() => navigate(`/${userRole}/home`)}
      >
        Neuro - Assist
      </Button>

      <nav className="flex gap-2">
        {user ? (
          <>
            {(navButtons[userRole] || []).map(({ label, icon: Icon, path }) => (
              <Button
                key={label}
                variant="outline"
                className="hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => navigate(path)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            ))}
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </>
        ) : location.pathname === '/login' ? (
          <Button variant="default" onClick={() => navigate('/register')}>
            Register
          </Button>
        ) : location.pathname === '/register' ? (
          <Button variant="default" onClick={() => navigate('/login')}>
            Login
          </Button>
        ) : (
          <span className="text-lg font-semibold">Welcome to our application</span>
        )}
      </nav>
    </header>
  );
};

export default Header;
