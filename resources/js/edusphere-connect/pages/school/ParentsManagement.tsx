import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FormDialog } from '@/components/shared/FormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Eye, UserPlus, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  occupation: string;
  children: { name: string; class: string }[];
  status: 'active' | 'inactive';
}

const MOCK_PARENTS: Parent[] = [
  { id: '1', firstName: 'Robert', lastName: 'Doe', email: 'robert.doe@email.com', phone: '+1 555-0201', occupation: 'Engineer', children: [{ name: 'John Doe', class: 'Grade 10 - A' }], status: 'active' },
  { id: '2', firstName: 'Mary', lastName: 'Smith', email: 'mary.smith@email.com', phone: '+1 555-0202', occupation: 'Doctor', children: [{ name: 'Jane Smith', class: 'Grade 10 - A' }], status: 'active' },
  { id: '3', firstName: 'David', lastName: 'Johnson', email: 'david.johnson@email.com', phone: '+1 555-0203', occupation: 'Lawyer', children: [{ name: 'Mike Johnson', class: 'Grade 9 - B' }], status: 'active' },
  { id: '4', firstName: 'Jennifer', lastName: 'Brown', email: 'jennifer.brown@email.com', phone: '+1 555-0204', occupation: 'Teacher', children: [{ name: 'Emily Brown', class: 'Grade 11 - A' }, { name: 'Tom Brown', class: 'Grade 9 - A' }], status: 'active' },
  { id: '5', firstName: 'Sarah', lastName: 'Wilson', email: 'sarah.wilson@email.com', phone: '+1 555-0205', occupation: 'Accountant', children: [{ name: 'Chris Wilson', class: 'Grade 10 - B' }], status: 'inactive' },
];

export default function ParentsManagement() {
  const { toast } = useToast();
  const [parents, setParents] = useState(MOCK_PARENTS);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', occupation: '',
  });

  const handleCreate = () => {
    setEditingParent(null);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', occupation: '' });
    setFormOpen(true);
  };

  const handleEdit = (parent: Parent) => {
    setEditingParent(parent);
    setFormData({
      firstName: parent.firstName, lastName: parent.lastName, email: parent.email,
      phone: parent.phone, occupation: parent.occupation,
    });
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (editingParent) {
      setParents(prev => prev.map(p => p.id === editingParent.id ? { ...p, ...formData } : p));
      toast({ title: 'Parent Updated' });
    } else {
      const newParent: Parent = {
        id: String(parents.length + 1),
        ...formData,
        children: [],
        status: 'active',
      };
      setParents(prev => [...prev, newParent]);
      toast({ title: 'Parent Added' });
    }
    setFormOpen(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Parent',
      render: (p: Parent) => (
        <div className="flex items-center gap-3">
          <Avatar><AvatarFallback>{p.firstName[0]}{p.lastName[0]}</AvatarFallback></Avatar>
          <div>
            <div className="font-medium">{p.firstName} {p.lastName}</div>
            <div className="text-sm text-muted-foreground">{p.occupation}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (p: Parent) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm"><Mail className="h-3 w-3" />{p.email}</div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground"><Phone className="h-3 w-3" />{p.phone}</div>
        </div>
      ),
    },
    {
      key: 'children',
      label: 'Children',
      render: (p: Parent) => (
        <div className="flex flex-wrap gap-1">
          {p.children.map((child, i) => (
            <Badge key={i} variant="secondary" className="text-xs">{child.name} ({child.class})</Badge>
          ))}
        </div>
      ),
    },
    { key: 'status', label: 'Status', render: (p: Parent) => <StatusBadge status={p.status} /> },
    {
      key: 'actions',
      label: '',
      render: (parent: Parent) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(parent)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Parents" description="Manage parent/guardian records" primaryAction={{ label: 'Add Parent', onClick: handleCreate, icon: <UserPlus className="mr-2 h-4 w-4" /> }} />

        <DataTable columns={columns} data={parents.filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()))} searchPlaceholder="Search parents..." searchValue={search} onSearchChange={setSearch} />

        <FormDialog open={formOpen} onOpenChange={setFormOpen} title={editingParent ? 'Edit Parent' : 'Add Parent'} onSubmit={handleSubmit} size="md">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>First Name</Label><Input value={formData.firstName} onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Last Name</Label><Input value={formData.lastName} onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Occupation</Label><Input value={formData.occupation} onChange={e => setFormData(p => ({ ...p, occupation: e.target.value }))} /></div>
          </div>
        </FormDialog>
      </div>
    </DashboardLayout>
  );
}
