import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface RoleBasedDashboardProps {
  children: React.ReactNode;
}

const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) return null;

  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case 'student':
        return 'Student Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      case 'clerk':
        return 'Clerk Dashboard';
      case 'hostel-warden':
        return 'Hostel Warden Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const getRoleDescription = (role: UserRole): string => {
    switch (role) {
      case 'student':
        return 'Access your academic records, assignments, and hostel information';
      case 'admin':
        return 'Manage system settings, users, and administrative functions';
      case 'clerk':
        return 'Handle student records, fees, and administrative tasks';
      case 'hostel-warden':
        return 'Manage hostel operations, room assignments, and student welfare';
      default:
        return 'Welcome to your dashboard';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {getRoleDisplayName(user.role)}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {getRoleDescription(user.role)}
        </p>
        <div className="mt-4 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-lg border border-brand-200 dark:border-brand-800">
          <p className="text-sm text-brand-700 dark:text-brand-300">
            <strong>Welcome, {user.firstName}!</strong> You are logged in as a{' '}
            <span className="capitalize">{user.role.replace('-', ' ')}</span>
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default RoleBasedDashboard;
