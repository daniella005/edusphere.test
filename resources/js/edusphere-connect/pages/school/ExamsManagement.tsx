import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FormDialog } from '@/components/shared/FormDialog';
import { StatsCard } from '@/components/shared/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, FileText, ClipboardList, Calendar, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Exam {
  id: string;
  name: string;
  type: 'midterm' | 'final' | 'quiz' | 'assignment';
  subject: string;
  class: string;
  date: string;
  startTime: string;
  duration: number;
  totalMarks: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

interface GradeEntry {
  id: string;
  studentName: string;
  examName: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  percentage: number;
}

const MOCK_EXAMS: Exam[] = [
  { id: '1', name: 'Midterm Examination', type: 'midterm', subject: 'Mathematics', class: 'Grade 10', date: '2024-02-15', startTime: '09:00', duration: 120, totalMarks: 100, status: 'scheduled' },
  { id: '2', name: 'Physics Quiz 3', type: 'quiz', subject: 'Physics', class: 'Grade 11', date: '2024-02-10', startTime: '10:00', duration: 30, totalMarks: 25, status: 'completed' },
  { id: '3', name: 'English Essay', type: 'assignment', subject: 'English Literature', class: 'Grade 10', date: '2024-02-20', startTime: '14:00', duration: 90, totalMarks: 50, status: 'scheduled' },
  { id: '4', name: 'Chemistry Final', type: 'final', subject: 'Chemistry', class: 'Grade 12', date: '2024-03-15', startTime: '09:00', duration: 180, totalMarks: 100, status: 'scheduled' },
  { id: '5', name: 'History Test', type: 'quiz', subject: 'World History', class: 'Grade 9', date: '2024-02-08', startTime: '11:00', duration: 45, totalMarks: 30, status: 'completed' },
];

const MOCK_GRADES: GradeEntry[] = [
  { id: '1', studentName: 'John Doe', examName: 'Physics Quiz 3', subject: 'Physics', marksObtained: 22, totalMarks: 25, grade: 'A', percentage: 88 },
  { id: '2', studentName: 'Jane Smith', examName: 'Physics Quiz 3', subject: 'Physics', marksObtained: 24, totalMarks: 25, grade: 'A+', percentage: 96 },
  { id: '3', studentName: 'Mike Johnson', examName: 'Physics Quiz 3', subject: 'Physics', marksObtained: 18, totalMarks: 25, grade: 'B+', percentage: 72 },
  { id: '4', studentName: 'Emily Brown', examName: 'History Test', subject: 'World History', marksObtained: 27, totalMarks: 30, grade: 'A', percentage: 90 },
  { id: '5', studentName: 'Chris Wilson', examName: 'History Test', subject: 'World History', marksObtained: 25, totalMarks: 30, grade: 'A-', percentage: 83 },
];

const TYPE_COLORS: Record<string, string> = {
  midterm: 'bg-primary/10 text-primary',
  final: 'bg-destructive/10 text-destructive',
  quiz: 'bg-info/10 text-info',
  assignment: 'bg-secondary/10 text-secondary-foreground',
};

export default function ExamsManagement() {
  const { toast } = useToast();
  const [exams, setExams] = useState(MOCK_EXAMS);
  const [grades] = useState(MOCK_GRADES);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [gradeFormOpen, setGradeFormOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  const [formData, setFormData] = useState({
    name: '', type: 'quiz', subject: '', class: '', date: '', startTime: '09:00', duration: '60', totalMarks: '100',
  });

  const handleCreate = () => {
    setEditingExam(null);
    setFormData({ name: '', type: 'quiz', subject: '', class: '', date: '', startTime: '09:00', duration: '60', totalMarks: '100' });
    setFormOpen(true);
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name, type: exam.type, subject: exam.subject, class: exam.class,
      date: exam.date, startTime: exam.startTime, duration: String(exam.duration), totalMarks: String(exam.totalMarks),
    });
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (editingExam) {
      setExams(prev => prev.map(e => e.id === editingExam.id ? { ...e, ...formData, duration: Number(formData.duration), totalMarks: Number(formData.totalMarks), type: formData.type as Exam['type'] } : e));
      toast({ title: 'Exam Updated' });
    } else {
      const newExam: Exam = {
        id: String(exams.length + 1),
        ...formData,
        duration: Number(formData.duration),
        totalMarks: Number(formData.totalMarks),
        type: formData.type as Exam['type'],
        status: 'scheduled',
      };
      setExams(prev => [...prev, newExam]);
      toast({ title: 'Exam Scheduled' });
    }
    setFormOpen(false);
  };

  const examColumns = [
    {
      key: 'name',
      label: 'Exam',
      render: (e: Exam) => (
        <div>
          <div className="font-medium">{e.name}</div>
          <div className="text-sm text-muted-foreground">{e.subject}</div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (e: Exam) => <Badge variant="outline" className={TYPE_COLORS[e.type]}>{e.type.charAt(0).toUpperCase() + e.type.slice(1)}</Badge>,
    },
    { key: 'class', label: 'Class' },
    { key: 'date', label: 'Date', render: (e: Exam) => new Date(e.date).toLocaleDateString() },
    { key: 'duration', label: 'Duration', render: (e: Exam) => `${e.duration} min` },
    { key: 'totalMarks', label: 'Marks' },
    { key: 'status', label: 'Status', render: (e: Exam) => <StatusBadge status={e.status === 'completed' ? 'completed' : e.status === 'ongoing' ? 'active' : e.status === 'cancelled' ? 'cancelled' : 'pending'} /> },
    {
      key: 'actions',
      label: '',
      render: (exam: Exam) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={() => handleEdit(exam)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
            <DropdownMenuItem><ClipboardList className="mr-2 h-4 w-4" />Enter Grades</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Cancel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const gradeColumns = [
    { key: 'studentName', label: 'Student' },
    { key: 'examName', label: 'Exam' },
    { key: 'subject', label: 'Subject' },
    { key: 'marks', label: 'Marks', render: (g: GradeEntry) => `${g.marksObtained}/${g.totalMarks}` },
    { key: 'percentage', label: 'Percentage', render: (g: GradeEntry) => `${g.percentage}%` },
    {
      key: 'grade',
      label: 'Grade',
      render: (g: GradeEntry) => (
        <Badge variant={g.grade.startsWith('A') ? 'default' : g.grade.startsWith('B') ? 'secondary' : 'outline'}>
          {g.grade}
        </Badge>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Exams & Grading" description="Schedule exams and manage grades" primaryAction={{ label: 'Schedule Exam', onClick: handleCreate }} />

        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard title="Upcoming Exams" value={exams.filter(e => e.status === 'scheduled').length} icon={Calendar} />
          <StatsCard title="Completed" value={exams.filter(e => e.status === 'completed').length} icon={FileText} />
          <StatsCard title="Average Score" value="78%" icon={TrendingUp} />
          <StatsCard title="Pass Rate" value="92%" icon={ClipboardList} />
        </div>

        <Tabs defaultValue="exams">
          <TabsList>
            <TabsTrigger value="exams">Exams</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="reports">Report Cards</TabsTrigger>
          </TabsList>

          <TabsContent value="exams" className="mt-6">
            <DataTable columns={examColumns} data={exams.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))} searchPlaceholder="Search exams..." searchValue={search} onSearchChange={setSearch} />
          </TabsContent>

          <TabsContent value="grades" className="mt-6">
            <DataTable columns={gradeColumns} data={grades} searchPlaceholder="Search grades..." />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Report Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grade9">Grade 9</SelectItem>
                      <SelectItem value="grade10">Grade 10</SelectItem>
                      <SelectItem value="grade11">Grade 11</SelectItem>
                      <SelectItem value="grade12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select Term" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fall">Fall Term</SelectItem>
                      <SelectItem value="spring">Spring Term</SelectItem>
                      <SelectItem value="summer">Summer Term</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Generate Reports</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <FormDialog open={formOpen} onOpenChange={setFormOpen} title={editingExam ? 'Edit Exam' : 'Schedule Exam'} onSubmit={handleSubmit} size="lg">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Exam Name</Label>
              <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Midterm Examination" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={v => setFormData(p => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="midterm">Midterm</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={formData.subject} onValueChange={v => setFormData(p => ({ ...p, subject: v }))}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="English Literature">English Literature</SelectItem>
                  <SelectItem value="World History">World History</SelectItem>
                </SelectContent>
              </Select>
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
              <Label>Date</Label>
              <Input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input type="time" value={formData.startTime} onChange={e => setFormData(p => ({ ...p, startTime: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input type="number" value={formData.duration} onChange={e => setFormData(p => ({ ...p, duration: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Total Marks</Label>
              <Input type="number" value={formData.totalMarks} onChange={e => setFormData(p => ({ ...p, totalMarks: e.target.value }))} />
            </div>
          </div>
        </FormDialog>
      </div>
    </DashboardLayout>
  );
}
