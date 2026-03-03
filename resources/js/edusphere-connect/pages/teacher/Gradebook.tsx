import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Save, Download, Upload, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentGrade {
  id: string;
  name: string;
  admissionNo: string;
  quiz1: number | null;
  quiz2: number | null;
  midterm: number | null;
  assignment: number | null;
  final: number | null;
  total: number;
  grade: string;
}

const MOCK_GRADES: StudentGrade[] = [
  { id: '1', name: 'John Doe', admissionNo: 'STU-001', quiz1: 18, quiz2: 20, midterm: 78, assignment: 45, final: null, total: 0, grade: '' },
  { id: '2', name: 'Jane Smith', admissionNo: 'STU-002', quiz1: 20, quiz2: 19, midterm: 85, assignment: 48, final: null, total: 0, grade: '' },
  { id: '3', name: 'Mike Johnson', admissionNo: 'STU-003', quiz1: 15, quiz2: 17, midterm: 72, assignment: 40, final: null, total: 0, grade: '' },
  { id: '4', name: 'Emily Brown', admissionNo: 'STU-004', quiz1: 19, quiz2: 20, midterm: 88, assignment: 47, final: null, total: 0, grade: '' },
  { id: '5', name: 'Chris Wilson', admissionNo: 'STU-005', quiz1: 16, quiz2: 18, midterm: 75, assignment: 42, final: null, total: 0, grade: '' },
  { id: '6', name: 'Sarah Davis', admissionNo: 'STU-006', quiz1: 20, quiz2: 20, midterm: 92, assignment: 50, final: null, total: 0, grade: '' },
  { id: '7', name: 'David Lee', admissionNo: 'STU-007', quiz1: 14, quiz2: 15, midterm: 68, assignment: 38, final: null, total: 0, grade: '' },
  { id: '8', name: 'Lisa Garcia', admissionNo: 'STU-008', quiz1: 17, quiz2: 19, midterm: 80, assignment: 44, final: null, total: 0, grade: '' },
];

const GRADE_WEIGHTS = {
  quiz1: 10,
  quiz2: 10,
  midterm: 30,
  assignment: 20,
  final: 30,
};

function calculateGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

export default function Gradebook() {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('grade10a');
  const [grades, setGrades] = useState(MOCK_GRADES);

  const handleGradeChange = (studentId: string, field: keyof StudentGrade, value: string) => {
    const numValue = value === '' ? null : Number(value);
    setGrades(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const updated = { ...s, [field]: numValue };
      // Calculate total if all grades are entered
      const q1 = updated.quiz1 ?? 0;
      const q2 = updated.quiz2 ?? 0;
      const mt = updated.midterm ?? 0;
      const asn = updated.assignment ?? 0;
      const fn = updated.final ?? 0;
      
      // Normalize to percentages
      const total = (q1 / 20 * GRADE_WEIGHTS.quiz1) +
                   (q2 / 20 * GRADE_WEIGHTS.quiz2) +
                   (mt / 100 * GRADE_WEIGHTS.midterm) +
                   (asn / 50 * GRADE_WEIGHTS.assignment) +
                   (fn / 100 * GRADE_WEIGHTS.final);
      
      updated.total = Math.round(total);
      updated.grade = calculateGrade(updated.total);
      return updated;
    }));
  };

  const handleSave = () => {
    toast({ title: 'Grades Saved', description: 'All changes have been saved successfully.' });
  };

  const getGradeBadgeVariant = (grade: string) => {
    if (grade.startsWith('A')) return 'default';
    if (grade.startsWith('B')) return 'secondary';
    if (grade.startsWith('C')) return 'outline';
    return 'destructive';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Gradebook" 
          description="Manage and record student grades"
          primaryAction={{ label: 'Save All', onClick: handleSave, icon: <Save className="mr-2 h-4 w-4" /> }}
          secondaryActions={[
            { label: 'Import', onClick: () => {}, variant: 'outline' },
            { label: 'Export', onClick: () => {}, variant: 'outline' },
          ]}
        />

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade10a">Grade 10 - A</SelectItem>
                  <SelectItem value="grade10b">Grade 10 - B</SelectItem>
                  <SelectItem value="grade11a">Grade 11 - A</SelectItem>
                  <SelectItem value="grade9a">Grade 9 - A</SelectItem>
                  <SelectItem value="grade9b">Grade 9 - B</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="current">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Spring 2024</SelectItem>
                  <SelectItem value="fall">Fall 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Grade Weights Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Grade Weightage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>Quiz 1: <Badge variant="outline">{GRADE_WEIGHTS.quiz1}% (20 pts)</Badge></div>
              <div>Quiz 2: <Badge variant="outline">{GRADE_WEIGHTS.quiz2}% (20 pts)</Badge></div>
              <div>Midterm: <Badge variant="outline">{GRADE_WEIGHTS.midterm}% (100 pts)</Badge></div>
              <div>Assignment: <Badge variant="outline">{GRADE_WEIGHTS.assignment}% (50 pts)</Badge></div>
              <div>Final: <Badge variant="outline">{GRADE_WEIGHTS.final}% (100 pts)</Badge></div>
            </div>
          </CardContent>
        </Card>

        {/* Grades Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Student</TableHead>
                    <TableHead className="text-center w-24">Quiz 1<br/><span className="text-xs text-muted-foreground">/20</span></TableHead>
                    <TableHead className="text-center w-24">Quiz 2<br/><span className="text-xs text-muted-foreground">/20</span></TableHead>
                    <TableHead className="text-center w-24">Midterm<br/><span className="text-xs text-muted-foreground">/100</span></TableHead>
                    <TableHead className="text-center w-24">Assignment<br/><span className="text-xs text-muted-foreground">/50</span></TableHead>
                    <TableHead className="text-center w-24">Final<br/><span className="text-xs text-muted-foreground">/100</span></TableHead>
                    <TableHead className="text-center w-20">Total</TableHead>
                    <TableHead className="text-center w-20">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-xs text-muted-foreground">{student.admissionNo}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={student.quiz1 ?? ''} 
                          onChange={e => handleGradeChange(student.id, 'quiz1', e.target.value)}
                          className="w-16 text-center mx-auto"
                          min={0}
                          max={20}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={student.quiz2 ?? ''} 
                          onChange={e => handleGradeChange(student.id, 'quiz2', e.target.value)}
                          className="w-16 text-center mx-auto"
                          min={0}
                          max={20}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={student.midterm ?? ''} 
                          onChange={e => handleGradeChange(student.id, 'midterm', e.target.value)}
                          className="w-16 text-center mx-auto"
                          min={0}
                          max={100}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={student.assignment ?? ''} 
                          onChange={e => handleGradeChange(student.id, 'assignment', e.target.value)}
                          className="w-16 text-center mx-auto"
                          min={0}
                          max={50}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={student.final ?? ''} 
                          onChange={e => handleGradeChange(student.id, 'final', e.target.value)}
                          className="w-16 text-center mx-auto"
                          min={0}
                          max={100}
                        />
                      </TableCell>
                      <TableCell className="text-center font-medium">{student.total || '-'}</TableCell>
                      <TableCell className="text-center">
                        {student.grade ? (
                          <Badge variant={getGradeBadgeVariant(student.grade)}>{student.grade}</Badge>
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
