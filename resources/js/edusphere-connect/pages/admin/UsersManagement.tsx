import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FormDialog } from '@/components/shared/FormDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Key, Shield, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlatformUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'super_admin' | 'support' | 'analyst';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

const MOCK_USERS: PlatformUser[] = [
  { id: '1', firstName: 'John', lastName: 'Admin', email: 'john@eduplatform.com', role: 'super_admin', status: 'active', lastLogin: '2024-01-20 10:30', createdAt: '2023-01-01' },
  { id: '2', firstName: 'Sarah', lastName: 'Support', email: 'sarah@eduplatform.com', role: 'support', status: 'active', lastLogin: '2024-01-20 09:15', createdAt: '2023-03-15' },
  { id: '3', firstName: 'Mike', lastName: 'Analytics', email: 'mike@eduplatform.com', role: 'analyst', status: 'active', lastLogin: '2024-01-19 16:45', createdAt: '2023-06-01' },
  { id: '4', firstName: 'Emily', lastName: 'Support', email: 'emily@eduplatform.com', role: 'support', status: 'inactive', lastLogin: '2023-12-15 14:20', createdAt: '2023-04-10' },
];

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-primary/10 text-primary',
  support: 'bg-info/10 text-info',
  analyst: 'bg-secondary/10 text-secondary',
};

export default function UsersManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PlatformUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'support' as PlatformUser['role'],
  });

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ firstName: '', lastName: '', email: '', role: 'support' });
    setFormOpen(true);
  };

  const handleEdit = (user: PlatformUser) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
      toast({ title: 'User Updated', description: `${formData.firstName} ${formData.lastName} has been updated.` });
    } else {
      const newUser: PlatformUser = {
        id: String(users.length + 1),
        ...formData,
        status: 'active',
        lastLogin: '-',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers(prev => [...prev, newUser]);
      toast({ title: 'User Created', description: `${formData.firstName} ${formData.lastName} has been invited.` });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      toast({ title: 'User Deleted', description: `${selectedUser.firstName} ${selectedUser.lastName} has been removed.`, variant: 'destructive' });
    }
    setDeleteOpen(false);
  };

  const handleResetPassword = () => {
    if (selectedUser) {
      toast({ title: 'Password Reset', description: `A password reset email has been sent to ${selectedUser.email}.` });
    }
    setResetPasswordOpen(false);
  };

  const handleToggleStatus = (user: PlatformUser) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    toast({
      title: `User ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
      description: `${user.firstName} ${user.lastName} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (user: PlatformUser) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.firstName} {user.lastName}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (user: PlatformUser) => (
        <Badge variant="outline" className={ROLE_COLORS[user.role]}>
          {user.role.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (user: PlatformUser) => <StatusBadge status={user.status} />,
    },
    { key: 'lastLogin', label: 'Last Login' },
    {
      key: 'actions',
      label: '',
      render: (user: PlatformUser) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={() => handleEdit(user)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSelectedUser(user); setResetPasswordOpen(true); }}>
              <Key className="mr-2 h-4 w-4" />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
              <UserCheck className="mr-2 h-4 w-4" />
              {user.status === 'active' ? 'Deactivate' : 'Activate'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSelectedUser(user); setDeleteOpen(true); }} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Platform Users"
          description="Manage administrators and support staff"
          primaryAction={{ label: 'Add User', onClick: handleCreate }}
        />

        <DataTable
          columns={columns}
          data={users.filter(u => 
            u.firstName.toLowerCase().includes(search.toLowerCase()) ||
            u.lastName.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
          )}
          searchPlaceholder="Search users..."
          searchValue={search}
          onSearchChange={setSearch}
        />

        <FormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          title={editingUser ? 'Edit User' : 'Add New User'}
          description={editingUser ? 'Update the user information.' : 'Invite a new platform user.'}
          onSubmit={handleSubmit}
          submitLabel={editingUser ? 'Update' : 'Send Invite'}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={formData.firstName}
                onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={formData.lastName}
                onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@eduplatform.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={(v: PlatformUser['role']) => setFormData(prev => ({ ...prev, role: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FormDialog>

        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete User"
          description={`Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          variant="destructive"
        />

        <ConfirmDialog
          open={resetPasswordOpen}
          onOpenChange={setResetPasswordOpen}
          title="Reset Password"
          description={`Send a password reset email to ${selectedUser?.email}?`}
          confirmLabel="Send Reset Email"
          onConfirm={handleResetPassword}
        />
      </div>
    </DashboardLayout>
  );
}
