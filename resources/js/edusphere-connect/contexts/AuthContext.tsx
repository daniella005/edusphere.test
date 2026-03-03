import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, School, UserRole, AuthContextType } from '@/types/auth';

// Mock users for development
const MOCK_USERS: Record<UserRole, User> = {
  super_admin: {
    id: 'sa-001',
    email: 'admin@eduplatform.com',
    firstName: 'Platform',
    lastName: 'Admin',
    role: 'super_admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  school_admin: {
    id: 'scha-001',
    email: 'principal@springfield.edu',
    firstName: 'Michael',
    lastName: 'Scott',
    role: 'school_admin',
    schoolId: 'school-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  teacher: {
    id: 'tch-001',
    email: 'teacher@springfield.edu',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'teacher',
    schoolId: 'school-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  student: {
    id: 'std-001',
    email: 'student@springfield.edu',
    firstName: 'John',
    lastName: 'Doe',
    role: 'student',
    schoolId: 'school-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  parent: {
    id: 'par-001',
    email: 'parent@email.com',
    firstName: 'Robert',
    lastName: 'Doe',
    role: 'parent',
    schoolId: 'school-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  staff: {
    id: 'stf-001',
    email: 'staff@springfield.edu',
    firstName: 'Emily',
    lastName: 'Brown',
    role: 'staff',
    schoolId: 'school-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

const MOCK_SCHOOL: School = {
  id: 'school-001',
  name: 'Springfield High School',
  code: 'SHS',
  email: 'info@springfield.edu',
  phone: '+1 (555) 123-4567',
  address: '123 Education Lane, Springfield, IL 62701',
  website: 'https://springfield.edu',
  subscriptionStatus: 'active',
  subscriptionPlan: 'premium',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo: determine role based on email
      let role: UserRole = 'student';
      if (email.includes('admin@eduplatform')) role = 'super_admin';
      else if (email.includes('principal')) role = 'school_admin';
      else if (email.includes('teacher')) role = 'teacher';
      else if (email.includes('parent')) role = 'parent';
      else if (email.includes('staff')) role = 'staff';

      const mockUser = MOCK_USERS[role];
      setUser(mockUser);
      
      if (role !== 'super_admin') {
        setSchool(MOCK_SCHOOL);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSchool(null);
  }, []);

  // Development helper to switch roles
  const switchRole = useCallback((role: UserRole) => {
    const mockUser = MOCK_USERS[role];
    setUser(mockUser);
    if (role !== 'super_admin') {
      setSchool(MOCK_SCHOOL);
    } else {
      setSchool(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        school,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
