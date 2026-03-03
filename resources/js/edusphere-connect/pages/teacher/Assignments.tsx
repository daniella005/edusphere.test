import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FormDialog } from '@/components/shared/FormDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Eye, FileText, Upload, Users, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  submissionsCount: number;
  totalStudents: number;
  gradedCount: number;
  status: 'active' | 'closed' | 'draft';
  createdAt: string;
}

const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: '1', title: 'Quadratic Equations Problem Set', subject: 'Mathematics', class: 'Grade 10 - A', description: 'Solve problems 1-20 from Chapter 4', dueDate: '2024-02-10', totalMarks: 50, submissionsCount: 32, totalStudents: 38, gradedCount: 28, status: 'active', createdAt: '2024-01-25' },
  { id: '2', title: 'Geometry Assignment', subject: 'Mathematics', class: 'Grade 9 - B', description: 'Complete the geometry worksheet', dueDate: '2024-02-05', totalMarks: 30, submissionsCount: 38, totalStudents: 38, gradedCount: 38, status: 'closed', createdAt: '2024-01-20' },
  { id: '3', title: 'Calculus Practice', subject: 'Mathematics', class: 'Grade 11 - A', description: 'Differentiation and integration problems', dueDate: '2024-02-15', totalMarks: 40, submissionsCount: 20, totalStudents: 32, gradedCount: 0, status: 'active', createdAt: '2024-01-28' },
  { id: '4', title: 'Algebra Quiz Prep', subject: 'Algebra', class: 'Grade 9 - A', description: 'Preparation problems for upcoming quiz', dueDate: '2024-02-08', totalMarks: 25, submissionsCount: 35, totalStudents: 40, gradedCount: 35, status: 'active', createdAt: '2024-01-22' },
  { id: '5', title: 'Statistics Project', subject: 'Mathematics', class: 'Grade 10 - B', description: 'Data collection and analysis project', dueDate: '2024-02-20', totalMarks: 100, submissionsCount: 5, totalStudents: 35, gradedCount: 0, status: 'draft', createdAt: '2024-01-30' },
];

export default function Assignments() {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const [formData, setFormData] = useState({
    title: '', subject: '', class: '', description: '', dueDate: '', totalMarks: '50',
  });

  const handleCreate = () => {
    setEditingAssignment(null);
    setFormData({ title: '', subject: '', class: '', description: '', dueDate: '', totalMarks: '50' });
    setFormOpen(true);
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title, subject: assignment.subject, class: assignment.class,
      description: assignment.description, dueDate: assignment.dueDate, totalMarks: String(assignment.totalMarks),
    });
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (editingAssignment) {
      setAssignments(prev => prev.map(a => a.id === editingAssignment.id ? { ...a, ...formData, totalMarks: Number(formData.totalMarks) } : a));
      toast({ title: 'Assignment Updated' });
    } else {
      const newAssignment: Assignment = {
        id: String(assignments.length + 1),
        ...formData,
        totalMarks: Number(formData.totalMarks),
        submissionsCount: 0,
        totalStudents: 38,
        gradedCount: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setAssignments(prev => [...prev, newAssignment]);
      toast({ title: 'Assignment Created' });
    }
    setFormOpen(false);
  };

  const activeAssignments = assignments.filter(a => a.status === 'active');
  const pendingGrading = assignments.reduce((acc, a) => acc + (a.submissionsCount - a.gradedCount), 0);

  const columns = [
    {
      key: 'title',
      label: 'Assignment',
      render: (a: Assignment) => (
        <div>
          <div className="font-medium">{a.title}</div>
          <div className="text-sm text-muted-foreground">{a.class} • {a.subject}</div>
        </div>
      ),
    },
    { key: 'dueDate', label: 'Due Date', render: (a: Assignment) => new Date(a.dueDate).toLocaleDateString() },
    { key: 'totalMarks', label: 'Marks' },
    {
      key: 'submissions',
      label: 'Submissions',
      render: (a: Assignment) => (
        <div className="space-y-1">
          <div className="text-sm">{a.submissionsCount}/{a.totalStudents}</div>
          <Progress value={(a.submissionsCount / a.totalStudents) * 100} className="h-1.5 w-20" />
        </div>
      ),
    },
    {
      key: 'graded',
      label: 'Graded',
      render: (a: Assignment) => (
        <div className="space-y-1">
          <div className="text-sm">{a.gradedCount}/{a.submissionsCount}</div>
          <Progress value={a.submissionsCount > 0 ? (a.gradedCount / a.submissionsCount) * 100 : 0} className="h-1.5 w-20" />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (a: Assignment) => <StatusBadge status={a.status === 'active' ? 'active' : a.status === 'closed' ? 'completed' : 'pending'} />,
    },
    {
      key: 'actions',
      label: '',
      render: (assignment: Assignment) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Submissions</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(assignment)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Assignments" 
          description="Create and manage class assignments"
          primaryAction={{ label: 'Create Assignment', onClick: handleCreate }}
        />

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Active Assignments</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{activeAssignments.length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending Grading</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{pendingGrading}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{assignments.reduce((acc, a) => acc + a.submissionsCount, 0)}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Avg. Submission Rate</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">87%</div></CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({assignments.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeAssignments.length})</TabsTrigger>
            <TabsTrigger value="grading">Needs Grading ({pendingGrading})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <DataTable columns={columns} data={assignments.filter(a => a.title.toLowerCase().includes(search.toLowerCase()))} searchPlaceholder="Search assignments..." searchValue={search} onSearchChange={setSearch} />
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <DataTable columns={columns} data={activeAssignments} />
          </TabsContent>

          <TabsContent value="grading" className="mt-6">
            <DataTable columns={columns} data={assignments.filter(a => a.submissionsCount > a.gradedCount)} />
          </TabsContent>
        </Tabs>

        <FormDialog open={formOpen} onOpenChange={setFormOpen} title={editingAssignment ? 'Edit Assignment' : 'Create Assignment'} onSubmit={handleSubmit} size="lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="Assignment title" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={formData.class} onValueChange={v => setFormData(p => ({ ...p, class: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grade 10 - A">Grade 10 - A</SelectItem>
                    <SelectItem value="Grade 10 - B">Grade 10 - B</SelectItem>
                    <SelectItem value="Grade 11 - A">Grade 11 - A</SelectItem>
                    <SelectItem value="Grade 9 - A">Grade 9 - A</SelectItem>
                    <SelectItem value="Grade 9 - B">Grade 9 - B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={formData.subject} onValueChange={v => setFormData(p => ({ ...p, subject: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Algebra">Algebra</SelectItem>
                    <SelectItem value="Geometry">Geometry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Assignment instructions..." rows={3} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" value={formData.dueDate} onChange={e => setFormData(p => ({ ...p, dueDate: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Total Marks</Label>
                <Input type="number" value={formData.totalMarks} onChange={e => setFormData(p => ({ ...p, totalMarks: e.target.value }))} />
              </div>
            </div>
          </div>
        </FormDialog>
      </div>
    </DashboardLayout>
  );
}
