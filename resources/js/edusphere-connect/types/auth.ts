// User roles in the system
export type UserRole = 
  | 'super_admin'
  | 'school_admin'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'staff';

// User profile
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string; // null for super_admin
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// School/Tenant
export interface School {
  id: string;
  name: string;
  code: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  subscriptionStatus: 'active' | 'suspended' | 'trial' | 'expired';
  subscriptionPlan?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  school: School | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // For development only
}

// Module configuration per school
export interface ModuleConfig {
  id: string;
  name: string;
  isEnabled: boolean;
  icon: string;
}

// Permission type
export interface Permission {
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  resource?: string;
}

// Role permissions map
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ['*'], // All permissions
  school_admin: [
    'school:manage',
    'users:manage',
    'academics:manage',
    'finance:manage',
    'reports:read',
    'settings:manage',
  ],
  teacher: [
    'classes:read',
    'students:read',
    'attendance:manage',
    'grades:manage',
    'assignments:manage',
    'schedule:read',
  ],
  student: [
    'classes:read',
    'grades:read',
    'assignments:read',
    'schedule:read',
    'fees:read',
  ],
  parent: [
    'children:read',
    'grades:read',
    'attendance:read',
    'fees:read',
    'communication:read',
  ],
  staff: [
    'attendance:read',
    'schedule:read',
    'hr:read',
  ],
};
