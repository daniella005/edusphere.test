import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { CheckCircle2, XCircle, Clock, AlertCircle, Save, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentAttendance {
  id: string;
  name: string;
  admissionNo: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

const MOCK_STUDENTS: StudentAttendance[] = [
  { id: '1', name: 'John Doe', admissionNo: 'STU-001', status: 'present' },
  { id: '2', name: 'Jane Smith', admissionNo: 'STU-002', status: 'present' },
  { id: '3', name: 'Mike Johnson', admissionNo: 'STU-003', status: 'absent' },
  { id: '4', name: 'Emily Brown', admissionNo: 'STU-004', status: 'present' },
  { id: '5', name: 'Chris Wilson', admissionNo: 'STU-005', status: 'late' },
  { id: '6', name: 'Sarah Davis', admissionNo: 'STU-006', status: 'present' },
  { id: '7', name: 'David Lee', admissionNo: 'STU-007', status: 'present' },
  { id: '8', name: 'Lisa Garcia', admissionNo: 'STU-008', status: 'excused' },
];

const STATUS_CONFIG = {
  present: { icon: CheckCircle2, color: 'bg-success/10 text-success border-success/30', label: 'Present' },
  absent: { icon: XCircle, color: 'bg-destructive/10 text-destructive border-destructive/30', label: 'Absent' },
  late: { icon: Clock, color: 'bg-warning/10 text-warning border-warning/30', label: 'Late' },
  excused: { icon: AlertCircle, color: 'bg-info/10 text-info border-info/30', label: 'Excused' },
};

export default function TeacherAttendance() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState('grade10a');
  const [students, setStudents] = useState(MOCK_STUDENTS);

  const handleStatusChange = (studentId: string, status: StudentAttendance['status']) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
    toast({ title: `All marked as ${status}` });
  };

  const handleSave = () => {
    toast({ title: 'Attendance Saved', description: 'Attendance has been recorded successfully.' });
  };

  const stats = {
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
    excused: students.filter(s => s.status === 'excused').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Mark Attendance" 
          description="Record student attendance for your classes"
          primaryAction={{ label: 'Save Attendance', onClick: handleSave, icon: <Save className="mr-2 h-4 w-4" /> }}
        />

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Date & Class Selection */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Select Date & Class</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade10a">Grade 10 - A (Mathematics)</SelectItem>
                  <SelectItem value="grade10b">Grade 10 - B (Mathematics)</SelectItem>
                  <SelectItem value="grade11a">Grade 11 - A (Mathematics)</SelectItem>
                  <SelectItem value="grade9a">Grade 9 - A (Algebra)</SelectItem>
                  <SelectItem value="grade9b">Grade 9 - B (Geometry)</SelectItem>
                </SelectContent>
              </Select>

              {/* Stats Summary */}
              <div className="space-y-2 pt-4 border-t">
                <div className="text-sm font-medium text-muted-foreground">Summary</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span>Present: {stats.present}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <span>Absent: {stats.absent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <span>Late: {stats.late}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-info" />
                    <span>Excused: {stats.excused}</span>
                  </div>
                </div>
                <div className="pt-2 text-sm font-medium">
                  Attendance Rate: {Math.round((stats.present + stats.late) / students.length * 100)}%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student List */}
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Grade 10 - A (Mathematics)</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleMarkAll('present')}>Mark All Present</Button>
                <Button variant="outline" size="sm" onClick={() => handleMarkAll('absent')}>Mark All Absent</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {students.map(student => {
                  const config = STATUS_CONFIG[student.status];
                  return (
                    <div key={student.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.admissionNo}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {(['present', 'absent', 'late', 'excused'] as const).map(status => {
                          const cfg = STATUS_CONFIG[status];
                          const Icon = cfg.icon;
                          const isSelected = student.status === status;
                          return (
                            <Button
                              key={status}
                              variant="outline"
                              size="sm"
                              className={`${isSelected ? cfg.color : ''} capitalize`}
                              onClick={() => handleStatusChange(student.id, status)}
                            >
                              <Icon className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">{cfg.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
