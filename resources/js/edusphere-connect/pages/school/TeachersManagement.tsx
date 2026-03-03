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
import { MoreHorizontal, Pencil, Trash2, Eye, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  department: string;
  subjects: string[];
  qualification: string;
  experience: number;
  joiningDate: string;
  status: 'active' | 'inactive';
}

const MOCK_TEACHERS: Teacher[] = [
  { id: '1', employeeId: 'TCH-001', firstName: 'Sarah', lastName: 'Williams', email: 'sarah.williams@school.edu', phone: '+1 555-1001', gender: 'female', department: 'Mathematics', subjects: ['Algebra', 'Geometry'], qualification: 'M.Sc Mathematics', experience: 8, joiningDate: '2018-06-15', status: 'active' },
  { id: '2', employeeId: 'TCH-002', firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@school.edu', phone: '+1 555-1002', gender: 'male', department: 'Science', subjects: ['Physics', 'Chemistry'], qualification: 'M.Sc Physics', experience: 12, joiningDate: '2015-08-01', status: 'active' },
  { id: '3', employeeId: 'TCH-003', firstName: 'Jennifer', lastName: 'Davis', email: 'jennifer.davis@school.edu', phone: '+1 555-1003', gender: 'female', department: 'English', subjects: ['English Literature', 'Grammar'], qualification: 'M.A English', experience: 6, joiningDate: '2020-01-10', status: 'active' },
  { id: '4', employeeId: 'TCH-004', firstName: 'Robert', lastName: 'Miller', email: 'robert.miller@school.edu', phone: '+1 555-1004', gender: 'male', department: 'History', subjects: ['World History', 'Civics'], qualification: 'M.A History', experience: 15, joiningDate: '2012-03-20', status: 'inactive' },
  { id: '5', employeeId: 'TCH-005', firstName: 'Emily', lastName: 'Anderson', email: 'emily.anderson@school.edu', phone: '+1 555-1005', gender: 'female', department: 'Computer Science', subjects: ['Programming', 'Web Development'], qualification: 'M.Tech CS', experience: 4, joiningDate: '2022-07-01', status: 'active' },
];

export default function TeachersManagement() {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: 'male',
    department: '', qualification: '', experience: '', joiningDate: '',
  });

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      t.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'all' || t.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleCreate = () => {
    setEditingTeacher(null);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', gender: 'male', department: '', qualification: '', experience: '', joiningDate: '' });
    setFormOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      firstName: teacher.firstName, lastName: teacher.lastName, email: teacher.email,
      phone: teacher.phone, gender: teacher.gender, department: teacher.department,
      qualification: teacher.qualification, experience: String(teacher.experience), joiningDate: teacher.joiningDate,
    });
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (editingTeacher) {
      setTeachers(prev => prev.map(t => t.id === editingTeacher.id ? { ...t, ...formData, gender: formData.gender as Teacher['gender'], experience: Number(formData.experience) } : t));
      toast({ title: 'Teacher Updated', description: `${formData.firstName} ${formData.lastName} has been updated.` });
    } else {
      const newTeacher: Teacher = {
        id: String(teachers.length + 1),
        employeeId: `TCH-${String(teachers.length + 1).padStart(3, '0')}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender as Teacher['gender'],
        department: formData.department,
        qualification: formData.qualification,
        joiningDate: formData.joiningDate,
        experience: Number(formData.experience),
        subjects: [],
        status: 'active',
      };
      setTeachers(prev => [...prev, newTeacher]);
      toast({ title: 'Teacher Added', description: `${formData.firstName} ${formData.lastName} has been added.` });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deletingTeacher) {
      setTeachers(prev => prev.filter(t => t.id !== deletingTeacher.id));
      toast({ title: 'Teacher Deleted', description: `${deletingTeacher.firstName} ${deletingTeacher.lastName} has been removed.`, variant: 'destructive' });
    }
    setDeleteOpen(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Teacher',
      render: (teacher: Teacher) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{teacher.firstName[0]}{teacher.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{teacher.firstName} {teacher.lastName}</div>
            <div className="text-sm text-muted-foreground">{teacher.employeeId}</div>
          </div>
        </div>
      ),
    },
    { key: 'department', label: 'Department' },
    {
      key: 'subjects',
      label: 'Subjects',
      render: (t: Teacher) => (
        <div className="flex flex-wrap gap-1">
          {t.subjects.slice(0, 2).map(s => (
            <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
          ))}
          {t.subjects.length > 2 && <Badge variant="outline" className="text-xs">+{t.subjects.length - 2}</Badge>}
        </div>
      ),
    },
    { key: 'experience', label: 'Experience', render: (t: Teacher) => `${t.experience} years` },
    { key: 'status', label: 'Status', render: (t: Teacher) => <StatusBadge status={t.status} /> },
    {
      key: 'actions',
      label: '',
      render: (teacher: Teacher) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(teacher)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setDeletingTeacher(teacher); setDeleteOpen(true); }} className="text-destructive">
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
        <PageHeader
          title="Teachers"
          description="Manage teaching staff"
          primaryAction={{ label: 'Add Teacher', onClick: handleCreate, icon: <UserPlus className="mr-2 h-4 w-4" /> }}
        />

        <div className="flex gap-4">
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="History">History</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={filteredTeachers}
          searchPlaceholder="Search teachers..."
          searchValue={search}
          onSearchChange={setSearch}
        />

        <FormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          title={editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
          description={editingTeacher ? 'Update teacher information.' : 'Add a new teacher to the school.'}
          onSubmit={handleSubmit}
          submitLabel={editingTeacher ? 'Update' : 'Add Teacher'}
          size="lg"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={formData.firstName} onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={formData.lastName} onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={formData.gender} onValueChange={v => setFormData(p => ({ ...p, gender: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={formData.department} onValueChange={v => setFormData(p => ({ ...p, department: v }))}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Qualification</Label>
              <Input value={formData.qualification} onChange={e => setFormData(p => ({ ...p, qualification: e.target.value }))} placeholder="e.g., M.Sc Mathematics" />
            </div>
            <div className="space-y-2">
              <Label>Experience (years)</Label>
              <Input type="number" value={formData.experience} onChange={e => setFormData(p => ({ ...p, experience: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Joining Date</Label>
              <Input type="date" value={formData.joiningDate} onChange={e => setFormData(p => ({ ...p, joiningDate: e.target.value }))} />
            </div>
          </div>
        </FormDialog>

        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete Teacher"
          description={`Are you sure you want to delete ${deletingTeacher?.firstName} ${deletingTeacher?.lastName}? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          variant="destructive"
        />
      </div>
    </DashboardLayout>
  );
}
