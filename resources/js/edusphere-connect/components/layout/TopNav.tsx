import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, LogOut, User, Settings, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserRole } from '@/types/auth';
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher';

interface TopNavProps {
  onMenuClick?: () => void;
}

const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: 'bg-destructive text-destructive-foreground',
  school_admin: 'bg-primary text-primary-foreground',
  teacher: 'bg-secondary text-secondary-foreground',
  student: 'bg-info text-info-foreground',
  parent: 'bg-success text-success-foreground',
  staff: 'bg-warning text-warning-foreground',
};

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  school_admin: 'School Admin',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
  staff: 'Staff',
};

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user, school, logout, switchRole } = useAuth();

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card px-3 sm:h-16 sm:px-6">
      {/* Left side - Menu button (mobile) + Search */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search - hidden on mobile, visible on tablet+ */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-48 pl-9 lg:w-64"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Mobile search button */}
        <Button variant="ghost" size="icon" className="sm:hidden">
          <Search className="h-5 w-5" />
        </Button>

        {/* Role badge - hidden on mobile */}
        <Badge className={cn("hidden sm:inline-flex", ROLE_COLORS[user.role])}>
          {ROLE_LABELS[user.role]}
        </Badge>

        {/* School name - hidden on mobile/tablet */}
        {school && (
          <span className="hidden text-sm text-muted-foreground lg:block">
            {school.name}
          </span>
        )}

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            3
          </span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full sm:h-10 sm:w-10">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Mobile: Show role badge */}
            <div className="px-2 py-1.5 sm:hidden">
              <Badge className={ROLE_COLORS[user.role]}>
                {ROLE_LABELS[user.role]}
              </Badge>
            </div>
            <DropdownMenuSeparator className="sm:hidden" />
            
            {/* Dev: Role switcher */}
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Switch Role (Dev)
            </DropdownMenuLabel>
            {Object.keys(ROLE_LABELS).map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => switchRole(role as UserRole)}
                className={user.role === role ? 'bg-accent' : ''}
              >
                {ROLE_LABELS[role as UserRole]}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
