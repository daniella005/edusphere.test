import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/shared/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, UserCheck, UserX, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

const MOCK_STUDENTS = [
  { id: '1', name: 'John Doe', admissionNo: 'STU-001' },
  { id: '2', name: 'Jane Smith', admissionNo: 'STU-002' },
  { id: '3', name: 'Mike Johnson', admissionNo: 'STU-003' },
  { id: '4', name: 'Emily Brown', admissionNo: 'STU-004' },
  { id: '5', name: 'Chris Wilson', admissionNo: 'STU-005' },
  { id: '6', name: 'Sarah Davis', admissionNo: 'STU-006' },
  { id: '7', name: 'David Lee', admissionNo: 'STU-007' },
  { id: '8', name: 'Lisa Garcia', admissionNo: 'STU-008' },
];

const STATUS_COLORS: Record<string, string> = {
  present: 'bg-success/10 text-success border-success/30',
  absent: 'bg-destructive/10 text-destructive border-destructive/30',
  late: 'bg-warning/10 text-warning border-warning/30',
  excused: 'bg-info/10 text-info border-info/30',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  present: <CheckCircle2 className="h-4 w-4" />,
  absent: <XCircle className="h-4 w-4" />,
  late: <Clock className="h-4 w-4" />,
  excused: <AlertCircle className="h-4 w-4" />,
};

export default function AttendanceManagement() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState('Grade 10 - A');
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({
    '1': 'present', '2': 'present', '3': 'absent', '4': 'present',
    '5': 'late', '6': 'present', '7': 'present', '8': 'excused',
  });

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    const newAttendance: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
    MOCK_STUDENTS.forEach(s => { newAttendance[s.id] = status; });
    setAttendance(newAttendance);
    toast({ title: `All marked as ${status}` });
  };

  const handleSave = () => {
    toast({ title: 'Attendance Saved', description: `Attendance for ${selectedClass} has been saved.` });
  };

  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;
  const lateCount = Object.values(attendance).filter(s => s === 'late').length;
  const attendanceRate = Math.round((presentCount / MOCK_STUDENTS.length) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Attendance" description="Mark and track student attendance" />

        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard title="Present" value={presentCount} icon={UserCheck} iconColor="text-success" />
          <StatsCard title="Absent" value={absentCount} icon={UserX} iconColor="text-destructive" />
          <StatsCard title="Late" value={lateCount} icon={Clock} iconColor="text-warning" />
          <StatsCard title="Attendance Rate" value={`${attendanceRate}%`} icon={Users} />
        </div>

        <Tabs defaultValue="mark">
          <TabsList>
            <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="mark" className="mt-6">
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
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grade 9 - A">Grade 9 - A</SelectItem>
                      <SelectItem value="Grade 9 - B">Grade 9 - B</SelectItem>
                      <SelectItem value="Grade 10 - A">Grade 10 - A</SelectItem>
                      <SelectItem value="Grade 10 - B">Grade 10 - B</SelectItem>
                      <SelectItem value="Grade 11 - A">Grade 11 - A</SelectItem>
                      <SelectItem value="Grade 12 - A">Grade 12 - A</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Attendance List */}
              <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{selectedClass}</CardTitle>
                    <p className="text-sm text-muted-foreground">
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
                    {MOCK_STUDENTS.map(student => (
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
                          {(['present', 'absent', 'late', 'excused'] as const).map(status => (
                            <Button
                              key={status}
                              variant="outline"
                              size="sm"
                              className={`${attendance[student.id] === status ? STATUS_COLORS[status] : ''} capitalize`}
                              onClick={() => handleStatusChange(student.id, status)}
                            >
                              {STATUS_ICONS[status]}
                              <span className="ml-1 hidden sm:inline">{status}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleSave}>Save Attendance</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="grade9">Grade 9</SelectItem>
                      <SelectItem value="grade10">Grade 10</SelectItem>
                      <SelectItem value="grade11">Grade 11</SelectItem>
                      <SelectItem value="grade12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select Month" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jan">January 2024</SelectItem>
                      <SelectItem value="feb">February 2024</SelectItem>
                      <SelectItem value="mar">March 2024</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Generate Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
