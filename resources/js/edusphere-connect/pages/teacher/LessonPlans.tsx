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
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Eye, Copy, FileText, Calendar, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  class: string;
  week: string;
  topic: string;
  objectives: string;
  materials: string;
  activities: string;
  assessment: string;
  status: 'draft' | 'submitted' | 'approved';
  createdAt: string;
}

const MOCK_LESSON_PLANS: LessonPlan[] = [
  { id: '1', title: 'Introduction to Quadratic Equations', subject: 'Mathematics', class: 'Grade 10 - A', week: 'Week 5', topic: 'Quadratic Equations', objectives: 'Students will understand the standard form of quadratic equations and solve basic equations.', materials: 'Textbook Chapter 4, Graphing calculator, Worksheets', activities: 'Lecture, Guided practice, Group work', assessment: 'Exit ticket, Homework assignment', status: 'approved', createdAt: '2024-01-20' },
  { id: '2', title: 'Graphing Quadratic Functions', subject: 'Mathematics', class: 'Grade 10 - A', week: 'Week 6', topic: 'Quadratic Functions', objectives: 'Students will graph quadratic functions and identify key features.', materials: 'Graphing software, Grid paper', activities: 'Demonstration, Hands-on practice', assessment: 'Graphing quiz', status: 'submitted', createdAt: '2024-01-25' },
  { id: '3', title: 'Basic Geometry Concepts', subject: 'Geometry', class: 'Grade 9 - B', week: 'Week 5', topic: 'Angles and Lines', objectives: 'Students will identify and measure angles, understand parallel lines.', materials: 'Protractor, Geometry set', activities: 'Measurement activities, Pair work', assessment: 'Worksheet completion', status: 'approved', createdAt: '2024-01-18' },
  { id: '4', title: 'Introduction to Calculus', subject: 'Mathematics', class: 'Grade 11 - A', week: 'Week 5', topic: 'Limits and Derivatives', objectives: 'Students will understand the concept of limits.', materials: 'Textbook Chapter 1, Calculator', activities: 'Lecture, Problem-solving', assessment: 'Practice problems', status: 'draft', createdAt: '2024-01-28' },
  { id: '5', title: 'Algebraic Expressions', subject: 'Algebra', class: 'Grade 9 - A', week: 'Week 5', topic: 'Polynomials', objectives: 'Students will simplify and evaluate algebraic expressions.', materials: 'Textbook, Algebra tiles', activities: 'Interactive lesson, Games', assessment: 'Quiz', status: 'approved', createdAt: '2024-01-15' },
];

export default function LessonPlans() {
  const { toast } = useToast();
  const [lessonPlans, setLessonPlans] = useState(MOCK_LESSON_PLANS);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);

  const [formData, setFormData] = useState({
    title: '', subject: '', class: '', week: '', topic: '',
    objectives: '', materials: '', activities: '', assessment: '',
  });

  const handleCreate = () => {
    setEditingPlan(null);
    setFormData({ title: '', subject: '', class: '', week: '', topic: '', objectives: '', materials: '', activities: '', assessment: '' });
    setFormOpen(true);
  };

  const handleEdit = (plan: LessonPlan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title, subject: plan.subject, class: plan.class, week: plan.week, topic: plan.topic,
      objectives: plan.objectives, materials: plan.materials, activities: plan.activities, assessment: plan.assessment,
    });
    setFormOpen(true);
  };

  const handleDuplicate = (plan: LessonPlan) => {
    const newPlan: LessonPlan = {
      ...plan,
      id: String(lessonPlans.length + 1),
      title: `${plan.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLessonPlans(prev => [...prev, newPlan]);
    toast({ title: 'Lesson Plan Duplicated' });
  };

  const handleSubmit = () => {
    if (editingPlan) {
      setLessonPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...p, ...formData } : p));
      toast({ title: 'Lesson Plan Updated' });
    } else {
      const newPlan: LessonPlan = {
        id: String(lessonPlans.length + 1),
        ...formData,
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setLessonPlans(prev => [...prev, newPlan]);
      toast({ title: 'Lesson Plan Created' });
    }
    setFormOpen(false);
  };

  const handleSubmitForApproval = (plan: LessonPlan) => {
    setLessonPlans(prev => prev.map(p => p.id === plan.id ? { ...p, status: 'submitted' } : p));
    toast({ title: 'Submitted for Approval' });
  };

  const columns = [
    {
      key: 'title',
      label: 'Lesson Plan',
      render: (p: LessonPlan) => (
        <div>
          <div className="font-medium">{p.title}</div>
          <div className="text-sm text-muted-foreground">{p.class} • {p.subject}</div>
        </div>
      ),
    },
    {
      key: 'week',
      label: 'Schedule',
      render: (p: LessonPlan) => <Badge variant="outline">{p.week}</Badge>,
    },
    { key: 'topic', label: 'Topic' },
    {
      key: 'status',
      label: 'Status',
      render: (p: LessonPlan) => (
        <StatusBadge status={p.status === 'approved' ? 'completed' : p.status === 'submitted' ? 'pending' : 'inactive'} />
      ),
    },
    { key: 'createdAt', label: 'Created' },
    {
      key: 'actions',
      label: '',
      render: (plan: LessonPlan) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(plan)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDuplicate(plan)}><Copy className="mr-2 h-4 w-4" />Duplicate</DropdownMenuItem>
            {plan.status === 'draft' && (
              <DropdownMenuItem onClick={() => handleSubmitForApproval(plan)}>
                <FileText className="mr-2 h-4 w-4" />Submit for Approval
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const draftPlans = lessonPlans.filter(p => p.status === 'draft');
  const approvedPlans = lessonPlans.filter(p => p.status === 'approved');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Lesson Plans" 
          description="Create and manage your lesson plans"
          primaryAction={{ label: 'New Lesson Plan', onClick: handleCreate }}
        />

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Plans</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{lessonPlans.length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-success">{approvedPlans.length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-warning">{lessonPlans.filter(p => p.status === 'submitted').length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{draftPlans.length}</div></CardContent>
          </Card>
        </div>

        <DataTable columns={columns} data={lessonPlans.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))} searchPlaceholder="Search lesson plans..." searchValue={search} onSearchChange={setSearch} />

        <FormDialog open={formOpen} onOpenChange={setFormOpen} title={editingPlan ? 'Edit Lesson Plan' : 'New Lesson Plan'} onSubmit={handleSubmit} size="lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="Lesson title" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
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
              <div className="space-y-2">
                <Label>Week</Label>
                <Select value={formData.week} onValueChange={v => setFormData(p => ({ ...p, week: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select week" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Week 1">Week 1</SelectItem>
                    <SelectItem value="Week 2">Week 2</SelectItem>
                    <SelectItem value="Week 3">Week 3</SelectItem>
                    <SelectItem value="Week 4">Week 4</SelectItem>
                    <SelectItem value="Week 5">Week 5</SelectItem>
                    <SelectItem value="Week 6">Week 6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Topic</Label>
              <Input value={formData.topic} onChange={e => setFormData(p => ({ ...p, topic: e.target.value }))} placeholder="Main topic" />
            </div>
            <div className="space-y-2">
              <Label>Learning Objectives</Label>
              <Textarea value={formData.objectives} onChange={e => setFormData(p => ({ ...p, objectives: e.target.value }))} placeholder="What students will learn..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Materials Needed</Label>
              <Textarea value={formData.materials} onChange={e => setFormData(p => ({ ...p, materials: e.target.value }))} placeholder="Books, tools, resources..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Activities</Label>
              <Textarea value={formData.activities} onChange={e => setFormData(p => ({ ...p, activities: e.target.value }))} placeholder="Planned activities..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Assessment</Label>
              <Textarea value={formData.assessment} onChange={e => setFormData(p => ({ ...p, assessment: e.target.value }))} placeholder="How learning will be assessed..." rows={2} />
            </div>
          </div>
        </FormDialog>
      </div>
    </DashboardLayout>
  );
}
