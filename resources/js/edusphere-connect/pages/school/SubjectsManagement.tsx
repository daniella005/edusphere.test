import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { FormDialog } from '@/components/shared/FormDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  type: 'core' | 'elective';
  classes: string[];
  teachers: string[];
  isActive: boolean;
}

const MOCK_SUBJECTS: Subject[] = [
  { id: '1', code: 'MATH101', name: 'Mathematics', department: 'Mathematics', credits: 4, type: 'core', classes: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'], teachers: ['Sarah Williams'], isActive: true },
  { id: '2', code: 'PHY101', name: 'Physics', department: 'Science', credits: 4, type: 'core', classes: ['Grade 11', 'Grade 12'], teachers: ['Michael Brown'], isActive: true },
  { id: '3', code: 'CHM101', name: 'Chemistry', department: 'Science', credits: 4, type: 'core', classes: ['Grade 11', 'Grade 12'], teachers: ['Michael Brown'], isActive: true },
  { id: '4', code: 'ENG101', name: 'English Literature', department: 'English', credits: 3, type: 'core', classes: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'], teachers: ['Jennifer Davis'], isActive: true },
  { id: '5', code: 'HIS101', name: 'World History', department: 'History', credits: 3, type: 'core', classes: ['Grade 9', 'Grade 10'], teachers: ['Robert Miller'], isActive: true },
  { id: '6', code: 'CS101', name: 'Computer Science', department: 'Computer Science', credits: 3, type: 'elective', classes: ['Grade 10', 'Grade 11', 'Grade 12'], teachers: ['Emily Anderson'], isActive: true },
  { id: '7', code: 'ART101', name: 'Fine Arts', department: 'Arts', credits: 2, type: 'elective', classes: ['Grade 9', 'Grade 10'], teachers: [], isActive: false },
];

export default function SubjectsManagement() {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  const [formData, setFormData] = useState({
    code: '', name: '', department: '', credits: '3', type: 'core',
  });

  const filteredSubjects = subjects.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || s.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreate = () => {
    setEditingSubject(null);
    setFormData({ code: '', name: '', department: '', credits: '3', type: 'core' });
    setFormOpen(true);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      code: subject.code, name: subject.name, department: subject.department,
      credits: String(subject.credits), type: subject.type,
    });
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (editingSubject) {
      setSubjects(prev => prev.map(s => s.id === editingSubject.id ? { ...s, ...formData, credits: Number(formData.credits), type: formData.type as 'core' | 'elective' } : s));
      toast({ title: 'Subject Updated' });
    } else {
      const newSubject: Subject = {
        id: String(subjects.length + 1),
        ...formData,
        credits: Number(formData.credits),
        type: formData.type as 'core' | 'elective',
        classes: [],
        teachers: [],
        isActive: true,
      };
      setSubjects(prev => [...prev, newSubject]);
      toast({ title: 'Subject Created' });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deletingSubject) {
      setSubjects(prev => prev.filter(s => s.id !== deletingSubject.id));
      toast({ title: 'Subject Deleted', variant: 'destructive' });
    }
    setDeleteOpen(false);
  };

  const handleToggleActive = (subject: Subject) => {
    setSubjects(prev => prev.map(s => s.id === subject.id ? { ...s, isActive: !s.isActive } : s));
    toast({ title: subject.isActive ? 'Subject Deactivated' : 'Subject Activated' });
  };

  const columns = [
    {
      key: 'name',
      label: 'Subject',
      render: (s: Subject) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{s.name}</div>
            <div className="text-sm text-muted-foreground">{s.code}</div>
          </div>
        </div>
      ),
    },
    { key: 'department', label: 'Department' },
    { key: 'credits', label: 'Credits' },
    {
      key: 'type',
      label: 'Type',
      render: (s: Subject) => (
        <Badge variant={s.type === 'core' ? 'default' : 'secondary'}>
          {s.type.charAt(0).toUpperCase() + s.type.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'classes',
      label: 'Classes',
      render: (s: Subject) => (
        <div className="flex flex-wrap gap-1">
          {s.classes.slice(0, 2).map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
          {s.classes.length > 2 && <Badge variant="outline" className="text-xs">+{s.classes.length - 2}</Badge>}
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (s: Subject) => (
        <Switch checked={s.isActive} onCheckedChange={() => handleToggleActive(s)} />
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (subject: Subject) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={() => handleEdit(subject)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setDeletingSubject(subject); setDeleteOpen(true); }} className="text-destructive">
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
        <PageHeader title="Subjects" description="Manage academic subjects" primaryAction={{ label: 'Add Subject', onClick: handleCreate }} />

        <div className="flex gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Filter by type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="core">Core</SelectItem>
              <SelectItem value="elective">Elective</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable columns={columns} data={filteredSubjects} searchPlaceholder="Search subjects..." searchValue={search} onSearchChange={setSearch} />

        <FormDialog open={formOpen} onOpenChange={setFormOpen} title={editingSubject ? 'Edit Subject' : 'Add New Subject'} onSubmit={handleSubmit} size="md">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Subject Code</Label>
                <Input value={formData.code} onChange={e => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="e.g., MATH101" />
              </div>
              <div className="space-y-2">
                <Label>Subject Name</Label>
                <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Mathematics" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
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
                    <SelectItem value="Arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Credits</Label>
                <Input type="number" value={formData.credits} onChange={e => setFormData(p => ({ ...p, credits: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={v => setFormData(p => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core (Mandatory)</SelectItem>
                  <SelectItem value="elective">Elective (Optional)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FormDialog>

        <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Subject" description={`Delete ${deletingSubject?.name}?`} confirmLabel="Delete" onConfirm={handleDelete} variant="destructive" />
      </div>
    </DashboardLayout>
  );
}
