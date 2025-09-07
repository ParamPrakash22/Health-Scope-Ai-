
import { useLocation, useNavigate } from 'react-router-dom';
import { Camera, Bell, Calendar, User } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: '/dashboard', icon: Calendar, label: 'Home' },
    { path: '/risk-scan', icon: Bell, label: 'Risk Scan' },
    { path: '/nutrition-scan', icon: Camera, label: 'Scan' },
    { path: '/reports', icon: Calendar, label: 'Reports' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-theme-nav-bg border-t border-border px-4 py-2 z-50 backdrop-blur-sm">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-primary bg-primary/10 scale-105' 
                  : 'text-muted-foreground hover:text-primary hover:bg-secondary'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
