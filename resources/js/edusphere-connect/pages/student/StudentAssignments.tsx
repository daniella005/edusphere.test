import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Upload, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  submittedDate?: string;
  status: 'pending' | 'submitted' | 'graded' | 'late' | 'overdue';
  grade?: string;
  feedback?: string;
  maxMarks: number;
  obtainedMarks?: number;
}

const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: '1', title: 'Math Problem Set 5', subject: 'Mathematics', description: 'Complete problems 1-20 from Chapter 5', dueDate: '2024-02-15', status: 'pending', maxMarks: 100 },
  { id: '2', title: 'Physics Lab Report', subject: 'Physics', description: 'Write a lab report on the pendulum experiment', dueDate: '2024-02-17', status: 'pending', maxMarks: 50 },
  { id: '3', title: 'English Essay', subject: 'English Literature', description: 'Write a 1000-word essay on Shakespeare', dueDate: '2024-02-20', status: 'pending', maxMarks: 100 },
  { id: '4', title: 'Chemistry Worksheet', subject: 'Chemistry', description: 'Balance chemical equations', dueDate: '2024-02-10', submittedDate: '2024-02-09', status: 'graded', maxMarks: 50, obtainedMarks: 45, grade: 'A', feedback: 'Excellent work! Minor errors in question 5.' },
  { id: '5', title: 'History Research Paper', subject: 'World History', description: 'Research paper on World War II', dueDate: '2024-02-08', submittedDate: '2024-02-08', status: 'submitted', maxMarks: 100 },
  { id: '6', title: 'Programming Assignment', subject: 'Computer Science', description: 'Build a calculator app', dueDate: '2024-02-05', submittedDate: '2024-02-06', status: 'late', maxMarks: 100, obtainedMarks: 80, grade: 'B', feedback: 'Good implementation but submitted late. 10% penalty applied.' },
];

export default function StudentAssignments() {
  const { toast } = useToast();
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const filteredAssignments = MOCK_ASSIGNMENTS.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || a.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const pendingAssignments = filteredAssignments.filter(a => a.status === 'pending');
  const submittedAssignments = filteredAssignments.filter(a => ['submitted', 'graded', 'late'].includes(a.status));

  const handleSubmit = () => {
    toast({ title: 'Assignment Submitted', description: 'Your assignment has been submitted successfully.' });
    setSubmitDialogOpen(false);
  };

  const getStatusIcon = (status: Assignment['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-warning" />;
      case 'submitted': return <CheckCircle2 className="h-4 w-4 text-info" />;
      case 'graded': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'late': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'overdue': return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Assignment',
      render: (a: Assignment) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{a.title}</div>
            <div className="text-sm text-muted-foreground">{a.subject}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (a: Assignment) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {new Date(a.dueDate).toLocaleDateString()}
        </div>
      ),
    },
    { key: 'maxMarks', label: 'Max Marks' },
    {
      key: 'status',
      label: 'Status',
      render: (a: Assignment) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(a.status)}
          <span className="capitalize">{a.status}</span>
        </div>
      ),
    },
    {
      key: 'grade',
      label: 'Grade',
      render: (a: Assignment) => a.grade ? (
        <Badge variant={a.grade.startsWith('A') ? 'default' : 'secondary'}>
          {a.obtainedMarks}/{a.maxMarks} ({a.grade})
        </Badge>
      ) : '-',
    },
    {
      key: 'actions',
      label: '',
      render: (a: Assignment) => (
        <div className="flex gap-2">
          {a.status === 'pending' && (
            <Button size="sm" onClick={() => { setSelectedAssignment(a); setSubmitDialogOpen(true); }}>
              <Upload className="mr-2 h-4 w-4" />Submit
            </Button>
          )}
          {a.status === 'graded' && (
            <Button size="sm" variant="outline" onClick={() => setSelectedAssignment(a)}>
              View Feedback
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="My Assignments" description="View and submit your assignments" />

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-warning">{MOCK_ASSIGNMENTS.filter(a => a.status === 'pending').length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Submitted</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-info">{MOCK_ASSIGNMENTS.filter(a => a.status === 'submitted').length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Graded</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-success">{MOCK_ASSIGNMENTS.filter(a => a.status === 'graded').length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">87%</div></CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Filter by subject" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="English Literature">English Literature</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="World History">World History</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
            <TabsTrigger value="submitted">Submitted ({submittedAssignments.length})</TabsTrigger>
            <TabsTrigger value="all">All ({filteredAssignments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <DataTable columns={columns} data={pendingAssignments} searchPlaceholder="Search assignments..." searchValue={search} onSearchChange={setSearch} />
          </TabsContent>

          <TabsContent value="submitted" className="mt-6">
            <DataTable columns={columns} data={submittedAssignments} />
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <DataTable columns={columns} data={filteredAssignments} searchPlaceholder="Search assignments..." searchValue={search} onSearchChange={setSearch} />
          </TabsContent>
        </Tabs>

        {/* Submit Dialog */}
        <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Assignment</DialogTitle>
              <DialogDescription>{selectedAssignment?.title}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="text-sm">{selectedAssignment?.description}</p>
                <p className="text-sm text-muted-foreground mt-2">Due: {selectedAssignment && new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="space-y-2">
                <Label>Your Answer / Notes</Label>
                <Textarea placeholder="Add any notes or paste your answer here..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Attach Files</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Drag files here or click to upload</p>
                </div>
              </div>
              <Button className="w-full" onClick={handleSubmit}>Submit Assignment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
