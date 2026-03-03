import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { FormDialog } from '@/components/shared/FormDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, Pencil, Trash2, Plus, Users, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClassItem {
  id: string;
  name: string;
  sections: Section[];
  academicYear: string;
}

interface Section {
  id: string;
  name: string;
  classTeacher: string;
  capacity: number;
  students: number;
}

const MOCK_CLASSES: ClassItem[] = [
  { id: '1', name: 'Grade 9', academicYear: '2024-2025', sections: [
    { id: '1a', name: 'A', classTeacher: 'Sarah Williams', capacity: 40, students: 38 },
    { id: '1b', name: 'B', classTeacher: 'Michael Brown', capacity: 40, students: 35 },
    { id: '1c', name: 'C', classTeacher: 'Jennifer Davis', capacity: 40, students: 40 },
  ]},
  { id: '2', name: 'Grade 10', academicYear: '2024-2025', sections: [
    { id: '2a', name: 'A', classTeacher: 'Robert Miller', capacity: 40, students: 36 },
    { id: '2b', name: 'B', classTeacher: 'Emily Anderson', capacity: 40, students: 39 },
  ]},
  { id: '3', name: 'Grade 11', academicYear: '2024-2025', sections: [
    { id: '3a', name: 'A', classTeacher: 'David Wilson', capacity: 35, students: 32 },
    { id: '3b', name: 'B', classTeacher: 'Lisa Garcia', capacity: 35, students: 30 },
  ]},
  { id: '4', name: 'Grade 12', academicYear: '2024-2025', sections: [
    { id: '4a', name: 'A', classTeacher: 'James Martinez', capacity: 30, students: 28 },
  ]},
];

export default function ClassesManagement() {
  const { toast } = useToast();
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [classFormOpen, setClassFormOpen] = useState(false);
  const [sectionFormOpen, setSectionFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const [classFormData, setClassFormData] = useState({ name: '', academicYear: '2024-2025' });
  const [sectionFormData, setSectionFormData] = useState({ name: '', classTeacher: '', capacity: '40' });

  const handleCreateClass = () => {
    setEditingClass(null);
    setClassFormData({ name: '', academicYear: '2024-2025' });
    setClassFormOpen(true);
  };

  const handleEditClass = (cls: ClassItem) => {
    setEditingClass(cls);
    setClassFormData({ name: cls.name, academicYear: cls.academicYear });
    setClassFormOpen(true);
  };

  const handleSubmitClass = () => {
    if (editingClass) {
      setClasses(prev => prev.map(c => c.id === editingClass.id ? { ...c, ...classFormData } : c));
      toast({ title: 'Class Updated' });
    } else {
      const newClass: ClassItem = {
        id: String(classes.length + 1),
        ...classFormData,
        sections: [],
      };
      setClasses(prev => [...prev, newClass]);
      toast({ title: 'Class Created' });
    }
    setClassFormOpen(false);
  };

  const handleAddSection = (cls: ClassItem) => {
    setSelectedClass(cls);
    setEditingSection(null);
    setSectionFormData({ name: '', classTeacher: '', capacity: '40' });
    setSectionFormOpen(true);
  };

  const handleSubmitSection = () => {
    if (!selectedClass) return;
    const newSection: Section = {
      id: `${selectedClass.id}${sectionFormData.name.toLowerCase()}`,
      name: sectionFormData.name,
      classTeacher: sectionFormData.classTeacher,
      capacity: Number(sectionFormData.capacity),
      students: 0,
    };
    setClasses(prev => prev.map(c => 
      c.id === selectedClass.id 
        ? { ...c, sections: [...c.sections, newSection] }
        : c
    ));
    toast({ title: 'Section Added' });
    setSectionFormOpen(false);
  };

  const totalStudents = classes.reduce((acc, c) => acc + c.sections.reduce((a, s) => a + s.students, 0), 0);
  const totalSections = classes.reduce((acc, c) => acc + c.sections.length, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Classes & Sections" description="Manage class structure and sections" primaryAction={{ label: 'Add Class', onClick: handleCreateClass }} />

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Classes</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{classes.length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Sections</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{totalSections}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{totalStudents}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Avg per Section</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{Math.round(totalStudents / totalSections)}</div></CardContent>
          </Card>
        </div>

        {/* Classes Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map(cls => (
            <Card key={cls.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">{cls.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{cls.academicYear}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover">
                    <DropdownMenuItem onClick={() => handleEditClass(cls)}><Pencil className="mr-2 h-4 w-4" />Edit Class</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddSection(cls)}><Plus className="mr-2 h-4 w-4" />Add Section</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cls.sections.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No sections yet</p>
                  ) : (
                    cls.sections.map(section => (
                      <div key={section.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Section {section.name}</Badge>
                          <div>
                            <div className="text-sm font-medium">{section.classTeacher}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {section.students}/{section.capacity} students
                            </div>
                          </div>
                        </div>
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${(section.students / section.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Class Form Dialog */}
        <FormDialog open={classFormOpen} onOpenChange={setClassFormOpen} title={editingClass ? 'Edit Class' : 'Add New Class'} onSubmit={handleSubmitClass}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Class Name</Label>
              <Input value={classFormData.name} onChange={e => setClassFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Grade 9" />
            </div>
            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Select value={classFormData.academicYear} onValueChange={v => setClassFormData(p => ({ ...p, academicYear: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FormDialog>

        {/* Section Form Dialog */}
        <FormDialog open={sectionFormOpen} onOpenChange={setSectionFormOpen} title={`Add Section to ${selectedClass?.name}`} onSubmit={handleSubmitSection}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Section Name</Label>
              <Input value={sectionFormData.name} onChange={e => setSectionFormData(p => ({ ...p, name: e.target.value.toUpperCase() }))} placeholder="e.g., A" maxLength={2} />
            </div>
            <div className="space-y-2">
              <Label>Class Teacher</Label>
              <Select value={sectionFormData.classTeacher} onValueChange={v => setSectionFormData(p => ({ ...p, classTeacher: v }))}>
                <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Williams">Sarah Williams</SelectItem>
                  <SelectItem value="Michael Brown">Michael Brown</SelectItem>
                  <SelectItem value="Jennifer Davis">Jennifer Davis</SelectItem>
                  <SelectItem value="Robert Miller">Robert Miller</SelectItem>
                  <SelectItem value="Emily Anderson">Emily Anderson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input type="number" value={sectionFormData.capacity} onChange={e => setSectionFormData(p => ({ ...p, capacity: e.target.value }))} />
            </div>
          </div>
        </FormDialog>
      </div>
    </DashboardLayout>
  );
}
