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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Eye, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Staff {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joiningDate: string;
  salary: number;
  status: 'active' | 'inactive';
}

const MOCK_STAFF: Staff[] = [
  { id: '1', employeeId: 'STF-001', firstName: 'David', lastName: 'Wilson', email: 'david.wilson@school.edu', phone: '+1 555-2001', role: 'Administrator', department: 'Administration', joiningDate: '2019-03-15', salary: 45000, status: 'active' },
  { id: '2', employeeId: 'STF-002', firstName: 'Lisa', lastName: 'Garcia', email: 'lisa.garcia@school.edu', phone: '+1 555-2002', role: 'Accountant', department: 'Finance', joiningDate: '2020-06-01', salary: 42000, status: 'active' },
  { id: '3', employeeId: 'STF-003', firstName: 'James', lastName: 'Martinez', email: 'james.martinez@school.edu', phone: '+1 555-2003', role: 'Security Guard', department: 'Security', joiningDate: '2021-01-10', salary: 28000, status: 'active' },
  { id: '4', employeeId: 'STF-004', firstName: 'Maria', lastName: 'Rodriguez', email: 'maria.rodriguez@school.edu', phone: '+1 555-2004', role: 'Librarian', department: 'Library', joiningDate: '2018-08-20', salary: 38000, status: 'active' },
  { id: '5', employeeId: 'STF-005', firstName: 'Thomas', lastName: 'Lee', email: 'thomas.lee@school.edu', phone: '+1 555-2005', role: 'IT Support', department: 'IT', joiningDate: '2022-02-01', salary: 48000, status: 'inactive' },
];

export default function StaffManagement() {
  const { toast } = useToast();
  const [staff, setStaff] = useState(MOCK_STAFF);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', role: '', department: '', joiningDate: '', salary: '',
  });

  const filteredStaff = staff.filter(s => {
    const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'all' || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleCreate = () => {
    setEditingStaff(null);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', role: '', department: '', joiningDate: '', salary: '' });
    setFormOpen(true);
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setFormData({
      firstName: staffMember.firstName, lastName: staffMember.lastName, email: staffMember.email,
      phone: staffMember.phone, role: staffMember.role, department: staffMember.department,
      joiningDate: staffMember.joiningDate, salary: String(staffMember.salary),
    });
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (editingStaff) {
      setStaff(prev => prev.map(s => s.id === editingStaff.id ? { ...s, ...formData, salary: Number(formData.salary) } : s));
      toast({ title: 'Staff Updated', description: `${formData.firstName} ${formData.lastName} has been updated.` });
    } else {
      const newStaff: Staff = {
        id: String(staff.length + 1),
        employeeId: `STF-${String(staff.length + 1).padStart(3, '0')}`,
        ...formData,
        salary: Number(formData.salary),
        status: 'active',
      };
      setStaff(prev => [...prev, newStaff]);
      toast({ title: 'Staff Added', description: `${formData.firstName} ${formData.lastName} has been added.` });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deletingStaff) {
      setStaff(prev => prev.filter(s => s.id !== deletingStaff.id));
      toast({ title: 'Staff Deleted', variant: 'destructive' });
    }
    setDeleteOpen(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Staff Member',
      render: (s: Staff) => (
        <div className="flex items-center gap-3">
          <Avatar><AvatarFallback>{s.firstName[0]}{s.lastName[0]}</AvatarFallback></Avatar>
          <div>
            <div className="font-medium">{s.firstName} {s.lastName}</div>
            <div className="text-sm text-muted-foreground">{s.employeeId}</div>
          </div>
        </div>
      ),
    },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status', render: (s: Staff) => <StatusBadge status={s.status} /> },
    {
      key: 'actions',
      label: '',
      render: (staffMember: Staff) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(staffMember)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setDeletingStaff(staffMember); setDeleteOpen(true); }} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Staff" description="Manage non-teaching staff" primaryAction={{ label: 'Add Staff', onClick: handleCreate, icon: <UserPlus className="mr-2 h-4 w-4" /> }} />

        <div className="flex gap-4">
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Filter by department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Administration">Administration</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Library">Library</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable columns={columns} data={filteredStaff} searchPlaceholder="Search staff..." searchValue={search} onSearchChange={setSearch} />

        <FormDialog open={formOpen} onOpenChange={setFormOpen} title={editingStaff ? 'Edit Staff' : 'Add New Staff'} onSubmit={handleSubmit} submitLabel={editingStaff ? 'Update' : 'Add Staff'} size="lg">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>First Name</Label><Input value={formData.firstName} onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Last Name</Label><Input value={formData.lastName} onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Role</Label><Input value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value }))} /></div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={formData.department} onValueChange={v => setFormData(p => ({ ...p, department: v }))}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Library">Library</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Joining Date</Label><Input type="date" value={formData.joiningDate} onChange={e => setFormData(p => ({ ...p, joiningDate: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Salary</Label><Input type="number" value={formData.salary} onChange={e => setFormData(p => ({ ...p, salary: e.target.value }))} /></div>
          </div>
        </FormDialog>

        <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Staff" description={`Delete ${deletingStaff?.firstName} ${deletingStaff?.lastName}?`} confirmLabel="Delete" onConfirm={handleDelete} variant="destructive" />
      </div>
    </DashboardLayout>
  );
}
