/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogOut, UserIcon, HistoryIcon, FilePlusIcon, HeartPulseIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/components/store/userStore';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore((state: any) => state.user);
  const resetUser = useUserStore((state: any) => state.resetUser);
  const userRole = user?.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    resetUser();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-background text-foreground shadow-sm">
      <div>
        <Button
          variant="ghost"
          className="text-xl font-bold hover:bg-muted"
          onClick={() => navigate('/' + userRole.toLowerCase() + '/home')}
        >
          Neuro - Assist
        </Button>
      </div>
      <nav className="flex gap-2">
        {user ? (
          user.role === 'Patient' ? (
            <>
              <Button
                variant="outline"
                className="hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => navigate('/patient/history')}
              >
                <HistoryIcon className="mr-2 h-4 w-4" />
                History
              </Button>
              <Button
                variant="outline"
                className="hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => navigate('/patient/profile')}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : user.role === 'Hospital' ? (
            <>
              <Button
                variant="outline"
                className="hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => navigate('/hospital/history')}
              >
                <HistoryIcon className="mr-2 h-4 w-4" />
                History
              </Button>
              <Button
                variant="outline"
                className="hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => navigate('/hospital/cases')}
              >
                <FilePlusIcon className="mr-2 h-4 w-4" />
                New Cases
              </Button>
              <Button
                variant="outline"
                className="hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => navigate('/hospital/guidelines')}
              >
                <HeartPulseIcon className="mr-2 h-4 w-4" />
                Guidelines
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : null
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
