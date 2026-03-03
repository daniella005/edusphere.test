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
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Eye, Building2, Power } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface School {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'trial' | 'suspended' | 'inactive';
  plan: string;
  students: number;
  teachers: number;
  createdAt: string;
}

const MOCK_SCHOOLS: School[] = [
  { id: '1', name: 'Lincoln High School', code: 'LHS', email: 'admin@lincoln.edu', phone: '+1 555-0101', address: '123 Lincoln Ave', status: 'active', plan: 'Premium', students: 1250, teachers: 85, createdAt: '2024-01-15' },
  { id: '2', name: 'Oak Valley Academy', code: 'OVA', email: 'admin@oakvalley.edu', phone: '+1 555-0102', address: '456 Oak St', status: 'trial', plan: 'Trial', students: 450, teachers: 32, createdAt: '2024-02-01' },
  { id: '3', name: 'Riverside Elementary', code: 'RSE', email: 'admin@riverside.edu', phone: '+1 555-0103', address: '789 River Rd', status: 'active', plan: 'Standard', students: 620, teachers: 45, createdAt: '2023-09-01' },
  { id: '4', name: 'Summit Prep School', code: 'SPS', email: 'admin@summit.edu', phone: '+1 555-0104', address: '321 Summit Blvd', status: 'suspended', plan: 'Premium', students: 380, teachers: 28, createdAt: '2023-06-15' },
  { id: '5', name: 'Westfield Middle School', code: 'WMS', email: 'admin@westfield.edu', phone: '+1 555-0105', address: '555 West Ave', status: 'active', plan: 'Standard', students: 890, teachers: 62, createdAt: '2023-08-20' },
  { id: '6', name: 'Greenwood Academy', code: 'GWA', email: 'admin@greenwood.edu', phone: '+1 555-0106', address: '888 Green Dr', status: 'active', plan: 'Premium', students: 720, teachers: 55, createdAt: '2023-11-10' },
  { id: '7', name: 'Harbor View School', code: 'HVS', email: 'admin@harborview.edu', phone: '+1 555-0107', address: '999 Harbor Way', status: 'inactive', plan: 'Standard', students: 0, teachers: 0, createdAt: '2022-12-01' },
];

export default function SchoolsManagement() {
  const { toast } = useToast();
  const [schools, setSchools] = useState(MOCK_SCHOOLS);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    address: '',
    plan: 'standard',
  });

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    setEditingSchool(null);
    setFormData({ name: '', code: '', email: '', phone: '', address: '', plan: 'standard' });
    setFormOpen(true);
  };

  const handleEdit = (school: School) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      code: school.code,
      email: school.email,
      phone: school.phone,
      address: school.address,
      plan: school.plan.toLowerCase(),
    });
    setFormOpen(true);
  };

  const handleDelete = (school: School) => {
    setDeletingSchool(school);
    setDeleteOpen(true);
  };

  const handleToggleStatus = (school: School) => {
    const newStatus = school.status === 'active' ? 'suspended' : 'active';
    setSchools(prev => prev.map(s => s.id === school.id ? { ...s, status: newStatus } : s));
    toast({
      title: `School ${newStatus === 'active' ? 'Activated' : 'Suspended'}`,
      description: `${school.name} has been ${newStatus === 'active' ? 'activated' : 'suspended'}.`,
    });
  };

  const handleSubmit = () => {
    if (editingSchool) {
      setSchools(prev => prev.map(s => s.id === editingSchool.id ? { ...s, ...formData, plan: formData.plan.charAt(0).toUpperCase() + formData.plan.slice(1) } : s));
      toast({ title: 'School Updated', description: `${formData.name} has been updated.` });
    } else {
      const newSchool: School = {
        id: String(schools.length + 1),
        ...formData,
        plan: formData.plan.charAt(0).toUpperCase() + formData.plan.slice(1),
        status: 'trial',
        students: 0,
        teachers: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setSchools(prev => [...prev, newSchool]);
      toast({ title: 'School Created', description: `${formData.name} has been created.` });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingSchool) {
      setSchools(prev => prev.filter(s => s.id !== deletingSchool.id));
      toast({ title: 'School Deleted', description: `${deletingSchool.name} has been deleted.`, variant: 'destructive' });
    }
    setDeleteOpen(false);
    setDeletingSchool(null);
  };

  const columns = [
    {
      key: 'name',
      label: 'School',
      render: (school: School) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{school.name}</div>
            <div className="text-sm text-muted-foreground">{school.code}</div>
          </div>
        </div>
      ),
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'status',
      label: 'Status',
      render: (school: School) => <StatusBadge status={school.status} />,
    },
    { key: 'plan', label: 'Plan' },
    {
      key: 'students',
      label: 'Students',
      render: (school: School) => school.students.toLocaleString(),
    },
    {
      key: 'actions',
      label: '',
      render: (school: School) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={() => {}}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(school)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleStatus(school)}>
              <Power className="mr-2 h-4 w-4" />
              {school.status === 'active' ? 'Suspend' : 'Activate'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(school)} className="text-destructive">
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
          title="Schools Management"
          description="Manage all registered schools on the platform"
          primaryAction={{ label: 'Add School', onClick: handleCreate }}
        />

        <DataTable
          columns={columns}
          data={filteredSchools}
          searchPlaceholder="Search schools..."
          searchValue={search}
          onSearchChange={setSearch}
          currentPage={currentPage}
          totalPages={Math.ceil(filteredSchools.length / pageSize)}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />

        <FormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          title={editingSchool ? 'Edit School' : 'Add New School'}
          description={editingSchool ? 'Update the school information.' : 'Create a new school on the platform.'}
          onSubmit={handleSubmit}
          submitLabel={editingSchool ? 'Update' : 'Create'}
          size="lg"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">School Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter school name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">School Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={e => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="e.g., LHS"
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="admin@school.edu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 555-0100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription Plan</Label>
              <Select value={formData.plan} onValueChange={v => setFormData(prev => ({ ...prev, plan: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter full address"
                rows={2}
              />
            </div>
          </div>
        </FormDialog>

        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete School"
          description={`Are you sure you want to delete "${deletingSchool?.name}"? This action cannot be undone and will remove all associated data.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          variant="destructive"
        />
      </div>
    </DashboardLayout>
  );
}
