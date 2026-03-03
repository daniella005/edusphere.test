import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/shared/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { UserCheck, UserX, Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AttendanceRecord {
  date: string;
  day: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  subject?: string;
  remarks?: string;
}

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { date: '2024-02-01', day: 'Thursday', status: 'present' },
  { date: '2024-02-02', day: 'Friday', status: 'present' },
  { date: '2024-02-05', day: 'Monday', status: 'present' },
  { date: '2024-02-06', day: 'Tuesday', status: 'late', remarks: 'Bus delay' },
  { date: '2024-02-07', day: 'Wednesday', status: 'present' },
  { date: '2024-02-08', day: 'Thursday', status: 'absent', remarks: 'Sick' },
  { date: '2024-02-09', day: 'Friday', status: 'excused', remarks: 'Medical appointment' },
  { date: '2024-02-12', day: 'Monday', status: 'present' },
  { date: '2024-02-13', day: 'Tuesday', status: 'present' },
  { date: '2024-02-14', day: 'Wednesday', status: 'late', remarks: 'Traffic' },
  { date: '2024-02-15', day: 'Thursday', status: 'present' },
];

const monthlyData = [
  { month: 'Sep', present: 20, absent: 1, late: 2 },
  { month: 'Oct', present: 19, absent: 2, late: 1 },
  { month: 'Nov', present: 18, absent: 1, late: 3 },
  { month: 'Dec', present: 15, absent: 0, late: 1 },
  { month: 'Jan', present: 18, absent: 1, late: 2 },
  { month: 'Feb', present: 8, absent: 1, late: 2 },
];

const subjectAttendance = [
  { subject: 'Mathematics', total: 45, attended: 43, percentage: 96 },
  { subject: 'Physics', total: 30, attended: 28, percentage: 93 },
  { subject: 'English Literature', total: 30, attended: 29, percentage: 97 },
  { subject: 'Chemistry', total: 30, attended: 27, percentage: 90 },
  { subject: 'World History', total: 45, attended: 44, percentage: 98 },
  { subject: 'Computer Science', total: 30, attended: 28, percentage: 93 },
];

const STATUS_CONFIG = {
  present: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Present' },
  absent: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Absent' },
  late: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Late' },
  excused: { icon: AlertCircle, color: 'text-info', bg: 'bg-info/10', label: 'Excused' },
};

export default function StudentAttendance() {
  const [monthFilter, setMonthFilter] = useState('february');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const presentCount = MOCK_ATTENDANCE.filter(a => a.status === 'present').length;
  const absentCount = MOCK_ATTENDANCE.filter(a => a.status === 'absent').length;
  const lateCount = MOCK_ATTENDANCE.filter(a => a.status === 'late').length;
  const totalDays = MOCK_ATTENDANCE.length;
  const attendanceRate = Math.round((presentCount / totalDays) * 100);

  // Create date modifiers for calendar
  const presentDates = MOCK_ATTENDANCE.filter(a => a.status === 'present').map(a => new Date(a.date));
  const absentDates = MOCK_ATTENDANCE.filter(a => a.status === 'absent').map(a => new Date(a.date));
  const lateDates = MOCK_ATTENDANCE.filter(a => a.status === 'late').map(a => new Date(a.date));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="My Attendance" description="View your attendance records" />

        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard title="Present Days" value={presentCount} icon={UserCheck} iconColor="text-success" />
          <StatsCard title="Absent Days" value={absentCount} icon={UserX} iconColor="text-destructive" />
          <StatsCard title="Late Arrivals" value={lateCount} icon={Clock} iconColor="text-warning" />
          <StatsCard title="Attendance Rate" value={`${attendanceRate}%`} icon={CheckCircle2} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar View */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Attendance Calendar</CardTitle>
              <CardDescription>February 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  present: presentDates,
                  absent: absentDates,
                  late: lateDates,
                }}
                modifiersStyles={{
                  present: { backgroundColor: 'hsl(var(--success) / 0.2)', color: 'hsl(var(--success))' },
                  absent: { backgroundColor: 'hsl(var(--destructive) / 0.2)', color: 'hsl(var(--destructive))' },
                  late: { backgroundColor: 'hsl(var(--warning) / 0.2)', color: 'hsl(var(--warning))' },
                }}
              />
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                <div className="flex items-center gap-1 text-sm"><div className="w-3 h-3 rounded-full bg-success/20" />Present</div>
                <div className="flex items-center gap-1 text-sm"><div className="w-3 h-3 rounded-full bg-destructive/20" />Absent</div>
                <div className="flex items-center gap-1 text-sm"><div className="w-3 h-3 rounded-full bg-warning/20" />Late</div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Attendance Trend</CardTitle>
              <CardDescription>Your attendance over the academic year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="hsl(var(--success))" name="Present" />
                    <Bar dataKey="late" fill="hsl(var(--warning))" name="Late" />
                    <Bar dataKey="absent" fill="hsl(var(--destructive))" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject-wise Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
            <CardDescription>Attendance breakdown by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Total Classes</TableHead>
                  <TableHead>Attended</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectAttendance.map(subject => (
                  <TableRow key={subject.subject}>
                    <TableCell className="font-medium">{subject.subject}</TableCell>
                    <TableCell>{subject.total}</TableCell>
                    <TableCell>{subject.attended}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${subject.percentage >= 75 ? 'bg-success' : 'bg-destructive'}`}
                            style={{ width: `${subject.percentage}%` }}
                          />
                        </div>
                        {subject.percentage}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={subject.percentage >= 75 ? 'default' : 'destructive'}>
                        {subject.percentage >= 75 ? 'Good' : 'Low'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Records */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ATTENDANCE.slice().reverse().map((record, i) => {
                  const config = STATUS_CONFIG[record.status];
                  const Icon = config.icon;
                  return (
                    <TableRow key={i}>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.day}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${config.color}`} />
                          <Badge variant="outline" className={config.bg}>{config.label}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{record.remarks || '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
