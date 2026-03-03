import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardList,
  CreditCard,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCog,
  FileText,
  Shield,
  Bus,
  Library,
  Heart,
  UserCheck,
  Layers,
  CalendarDays,
  Megaphone,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserRole } from '@/types/auth';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const SUPER_ADMIN_NAV: NavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['super_admin'] },
  { title: 'Schools', href: '/admin/schools', icon: Building2, roles: ['super_admin'] },
  { title: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard, roles: ['super_admin'] },
  { title: 'Users', href: '/admin/users', icon: UserCog, roles: ['super_admin'] },
  { title: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['super_admin'] },
  { title: 'Support', href: '/admin/support', icon: MessageSquare, roles: ['super_admin'] },
  { title: 'Audit Logs', href: '/admin/audit', icon: Shield, roles: ['super_admin'] },
  { title: 'Settings', href: '/admin/settings', icon: Settings, roles: ['super_admin'] },
];

const SCHOOL_NAV: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['school_admin', 'teacher', 'student', 'parent', 'staff'] },
  { title: 'Students', href: '/school/students', icon: GraduationCap, roles: ['school_admin', 'teacher'] },
  { title: 'Teachers', href: '/school/teachers', icon: UserCheck, roles: ['school_admin'] },
  { title: 'Staff', href: '/school/staff', icon: Users, roles: ['school_admin'] },
  { title: 'Parents', href: '/school/parents', icon: Users, roles: ['school_admin'] },
  { title: 'Classes', href: '/school/classes', icon: Layers, roles: ['school_admin', 'teacher'] },
  { title: 'Subjects', href: '/school/subjects', icon: BookOpen, roles: ['school_admin', 'teacher'] },
  { title: 'Academic Years', href: '/school/academic-years', icon: CalendarDays, roles: ['school_admin'] },
  { title: 'Timetable', href: '/school/timetable', icon: Calendar, roles: ['school_admin', 'teacher', 'student', 'parent'] },
  { title: 'Attendance', href: '/school/attendance', icon: ClipboardList, roles: ['school_admin', 'teacher', 'student', 'parent'] },
  { title: 'Exams', href: '/school/exams', icon: FileText, roles: ['school_admin', 'teacher', 'student', 'parent'] },
  { title: 'Fees', href: '/school/fees', icon: CreditCard, roles: ['school_admin', 'student', 'parent'] },
  { title: 'Announcements', href: '/school/announcements', icon: Megaphone, roles: ['school_admin', 'teacher', 'student', 'parent', 'staff'] },
  { title: 'Library', href: '/school/library', icon: Library, roles: ['school_admin', 'teacher', 'student'] },
  { title: 'Transport', href: '/school/transport', icon: Bus, roles: ['school_admin'] },
  { title: 'HR', href: '/school/hr', icon: Heart, roles: ['school_admin', 'staff'] },
  { title: 'Reports', href: '/school/reports', icon: BarChart3, roles: ['school_admin'] },
  { title: 'Settings', href: '/school/settings', icon: Settings, roles: ['school_admin'] },
];

const TEACHER_NAV: NavItem[] = [
  { title: 'Dashboard', href: '/teacher', icon: LayoutDashboard, roles: ['teacher'] },
  { title: 'My Classes', href: '/teacher/classes', icon: Layers, roles: ['teacher'] },
  { title: 'Gradebook', href: '/teacher/gradebook', icon: BookOpen, roles: ['teacher'] },
  { title: 'Attendance', href: '/teacher/attendance', icon: ClipboardList, roles: ['teacher'] },
  { title: 'Assignments', href: '/teacher/assignments', icon: FileText, roles: ['teacher'] },
  { title: 'Lesson Plans', href: '/teacher/lesson-plans', icon: Calendar, roles: ['teacher'] },
  { title: 'Announcements', href: '/school/announcements', icon: Megaphone, roles: ['teacher'] },
];

const STUDENT_NAV: NavItem[] = [
  { title: 'Dashboard', href: '/student', icon: LayoutDashboard, roles: ['student'] },
  { title: 'My Courses', href: '/student/courses', icon: BookOpen, roles: ['student'] },
  { title: 'Assignments', href: '/student/assignments', icon: FileText, roles: ['student'] },
  { title: 'Grades', href: '/student/grades', icon: GraduationCap, roles: ['student'] },
  { title: 'Attendance', href: '/student/attendance', icon: ClipboardList, roles: ['student'] },
  { title: 'Timetable', href: '/student/timetable', icon: Calendar, roles: ['student'] },
  { title: 'Announcements', href: '/school/announcements', icon: Megaphone, roles: ['student'] },
];

function SidebarContent({ 
  collapsed, 
  onToggleCollapse, 
  isMobile = false,
  onItemClick 
}: { 
  collapsed: boolean; 
  onToggleCollapse: () => void; 
  isMobile?: boolean;
  onItemClick?: () => void;
}) {
  const { user, school } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isSuperAdmin = user.role === 'super_admin';
  const isTeacher = user.role === 'teacher';
  const isStudent = user.role === 'student';
  
  let navItems: NavItem[];
  if (isSuperAdmin) {
    navItems = SUPER_ADMIN_NAV;
  } else if (isTeacher) {
    navItems = TEACHER_NAV;
  } else if (isStudent) {
    navItems = STUDENT_NAV;
  } else {
    navItems = SCHOOL_NAV;
  }
  
  const filteredNav = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {(!collapsed || isMobile) && (
          <Link to="/" className="flex items-center gap-2" onClick={onItemClick}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">
              {isSuperAdmin ? 'EduPlatform' : school?.code || 'SMS'}
            </span>
          </Link>
        )}
        {collapsed && !isMobile && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-3">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            const linkContent = (
              <Link
                to={item.href}
                onClick={onItemClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
                {(!collapsed || isMobile) && <span>{item.title}</span>}
              </Link>
            );

            if (collapsed && !isMobile) {
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{linkContent}</div>;
          })}
        </nav>
      </ScrollArea>

      {/* Collapse toggle - desktop only */}
      {!isMobile && (
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            onClick={onToggleCollapse}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen = false, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Sidebar - Sheet/Drawer */}
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && onMobileClose?.()}>
        <SheetContent side="left" className="w-72 bg-sidebar p-0 border-sidebar-border">
          <SidebarContent 
            collapsed={false} 
            onToggleCollapse={onToggleCollapse} 
            isMobile={true}
            onItemClick={onMobileClose}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen bg-sidebar transition-all duration-300 md:block",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      </aside>
    </>
  );
}
