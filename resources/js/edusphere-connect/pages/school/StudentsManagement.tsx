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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Eye, Upload, Download, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  class: string;
  section: string;
  parentName: string;
  parentPhone: string;
  status: 'active' | 'inactive' | 'suspended';
  enrollmentDate: string;
}

const MOCK_STUDENTS: Student[] = [
  { id: '1', admissionNo: 'STU-2024-001', firstName: 'John', lastName: 'Doe', email: 'john.doe@school.edu', phone: '+1 555-0101', gender: 'male', dateOfBirth: '2008-05-15', class: 'Grade 10', section: 'A', parentName: 'Robert Doe', parentPhone: '+1 555-0201', status: 'active', enrollmentDate: '2022-09-01' },
  { id: '2', admissionNo: 'STU-2024-002', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@school.edu', phone: '+1 555-0102', gender: 'female', dateOfBirth: '2008-08-22', class: 'Grade 10', section: 'A', parentName: 'Mary Smith', parentPhone: '+1 555-0202', status: 'active', enrollmentDate: '2022-09-01' },
  { id: '3', admissionNo: 'STU-2024-003', firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@school.edu', phone: '+1 555-0103', gender: 'male', dateOfBirth: '2009-01-10', class: 'Grade 9', section: 'B', parentName: 'David Johnson', parentPhone: '+1 555-0203', status: 'active', enrollmentDate: '2023-09-01' },
  { id: '4', admissionNo: 'STU-2024-004', firstName: 'Emily', lastName: 'Brown', email: 'emily.brown@school.edu', phone: '+1 555-0104', gender: 'female', dateOfBirth: '2007-11-30', class: 'Grade 11', section: 'A', parentName: 'James Brown', parentPhone: '+1 555-0204', status: 'suspended', enrollmentDate: '2021-09-01' },
  { id: '5', admissionNo: 'STU-2024-005', firstName: 'Chris', lastName: 'Wilson', email: 'chris.wilson@school.edu', phone: '+1 555-0105', gender: 'male', dateOfBirth: '2008-03-25', class: 'Grade 10', section: 'B', parentName: 'Sarah Wilson', parentPhone: '+1 555-0205', status: 'active', enrollmentDate: '2022-09-01' },
];

export default function StudentsManagement() {
  const { toast } = useToast();
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: 'male',
    dateOfBirth: '', class: '', section: '', parentName: '', parentPhone: '',
  });

  const filteredStudents = students.filter(s => {
    const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === 'all' || s.class === classFilter;
    return matchesSearch && matchesClass;
  });

  const handleCreate = () => {
    setEditingStudent(null);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', gender: 'male', dateOfBirth: '', class: '', section: '', parentName: '', parentPhone: '' });
    setFormOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName, lastName: student.lastName, email: student.email,
      phone: student.phone, gender: student.gender, dateOfBirth: student.dateOfBirth,
      class: student.class, section: student.section, parentName: student.parentName, parentPhone: student.parentPhone,
    });
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, ...formData, gender: formData.gender as Student['gender'] } : s));
      toast({ title: 'Student Updated', description: `${formData.firstName} ${formData.lastName} has been updated.` });
    } else {
      const newStudent: Student = {
        id: String(students.length + 1),
        admissionNo: `STU-2024-${String(students.length + 1).padStart(3, '0')}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender as Student['gender'],
        dateOfBirth: formData.dateOfBirth,
        class: formData.class,
        section: formData.section,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        status: 'active',
        enrollmentDate: new Date().toISOString().split('T')[0],
      };
      setStudents(prev => [...prev, newStudent]);
      toast({ title: 'Student Created', description: `${formData.firstName} ${formData.lastName} has been enrolled.` });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deletingStudent) {
      setStudents(prev => prev.filter(s => s.id !== deletingStudent.id));
      toast({ title: 'Student Deleted', description: `${deletingStudent.firstName} ${deletingStudent.lastName} has been removed.`, variant: 'destructive' });
    }
    setDeleteOpen(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Student',
      render: (student: Student) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{student.firstName[0]}{student.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{student.firstName} {student.lastName}</div>
            <div className="text-sm text-muted-foreground">{student.admissionNo}</div>
          </div>
        </div>
      ),
    },
    { key: 'class', label: 'Class', render: (s: Student) => `${s.class} - ${s.section}` },
    { key: 'email', label: 'Email' },
    { key: 'parentName', label: 'Parent/Guardian' },
    { key: 'status', label: 'Status', render: (s: Student) => <StatusBadge status={s.status} /> },
    {
      key: 'actions',
      label: '',
      render: (student: Student) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(student)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setDeletingStudent(student); setDeleteOpen(true); }} className="text-destructive">
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
          title="Students"
          description="Manage student records and enrollment"
          primaryAction={{ label: 'Add Student', onClick: handleCreate, icon: <UserPlus className="mr-2 h-4 w-4" /> }}
          secondaryActions={[
            { label: 'Import', onClick: () => {}, variant: 'outline' },
            { label: 'Export', onClick: () => {}, variant: 'outline' },
          ]}
        />

        <div className="flex gap-4">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="Grade 9">Grade 9</SelectItem>
              <SelectItem value="Grade 10">Grade 10</SelectItem>
              <SelectItem value="Grade 11">Grade 11</SelectItem>
              <SelectItem value="Grade 12">Grade 12</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={filteredStudents}
          searchPlaceholder="Search students..."
          searchValue={search}
          onSearchChange={setSearch}
        />

        <FormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          title={editingStudent ? 'Edit Student' : 'Add New Student'}
          description={editingStudent ? 'Update student information.' : 'Enroll a new student.'}
          onSubmit={handleSubmit}
          submitLabel={editingStudent ? 'Update' : 'Enroll'}
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
              <Label>Date of Birth</Label>
              <Input type="date" value={formData.dateOfBirth} onChange={e => setFormData(p => ({ ...p, dateOfBirth: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={formData.class} onValueChange={v => setFormData(p => ({ ...p, class: v }))}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grade 9">Grade 9</SelectItem>
                  <SelectItem value="Grade 10">Grade 10</SelectItem>
                  <SelectItem value="Grade 11">Grade 11</SelectItem>
                  <SelectItem value="Grade 12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Section</Label>
              <Select value={formData.section} onValueChange={v => setFormData(p => ({ ...p, section: v }))}>
                <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                  <SelectItem value="C">Section C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Parent/Guardian Name</Label>
              <Input value={formData.parentName} onChange={e => setFormData(p => ({ ...p, parentName: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Parent Phone</Label>
              <Input value={formData.parentPhone} onChange={e => setFormData(p => ({ ...p, parentPhone: e.target.value }))} />
            </div>
          </div>
        </FormDialog>

        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete Student"
          description={`Are you sure you want to delete ${deletingStudent?.firstName} ${deletingStudent?.lastName}? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          variant="destructive"
        />
      </div>
    </DashboardLayout>
  );
}
