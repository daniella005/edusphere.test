import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/shared/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, ClipboardList, Calendar, GraduationCap, FileText, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const upcomingAssignments = [
  { id: '1', title: 'Math Problem Set 5', subject: 'Mathematics', dueDate: '2024-02-15', status: 'pending' },
  { id: '2', title: 'Physics Lab Report', subject: 'Physics', dueDate: '2024-02-17', status: 'pending' },
  { id: '3', title: 'English Essay', subject: 'English', dueDate: '2024-02-20', status: 'in_progress' },
];

const todaySchedule = [
  { time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Sarah Williams', room: 'Room 101' },
  { time: '08:50 - 09:35', subject: 'English', teacher: 'Jennifer Davis', room: 'Room 102' },
  { time: '09:40 - 10:25', subject: 'Physics', teacher: 'Michael Brown', room: 'Lab 1' },
  { time: '10:40 - 11:25', subject: 'History', teacher: 'Robert Miller', room: 'Room 103' },
];

const recentGrades = [
  { subject: 'Mathematics', exam: 'Quiz 3', grade: 'A', percentage: 92 },
  { subject: 'Physics', exam: 'Midterm', grade: 'B+', percentage: 87 },
  { subject: 'English', exam: 'Essay', grade: 'A-', percentage: 90 },
];

export default function StudentDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader title="Welcome back, John!" description="Here's what's happening with your studies" />

        <div className="grid gap-3 grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <StatsCard title="Current GPA" value="3.75" icon={GraduationCap} trend={{ value: '+0.15', direction: 'up' }} />
          <StatsCard title="Attendance" value="94%" icon={ClipboardList} />
          <StatsCard title="Pending" value="3" icon={FileText} description="Assignments" />
          <StatsCard title="Today" value="6" icon={BookOpen} description="Classes" />
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Today's Schedule */}
          <Card>
            <CardHeader className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  Today's Schedule
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your classes for today</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                <Link to="/student/timetable">View Full</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-2 sm:space-y-3">
                {todaySchedule.map((slot, i) => (
                  <div key={i} className="flex flex-col gap-1 rounded-lg border p-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="text-xs font-medium text-muted-foreground sm:text-sm sm:w-24">{slot.time}</div>
                      <div className="hidden sm:block">
                        <div className="font-medium">{slot.subject}</div>
                        <div className="text-sm text-muted-foreground">{slot.teacher} • {slot.room}</div>
                      </div>
                    </div>
                    <div className="sm:hidden">
                      <div className="text-sm font-medium">{slot.subject}</div>
                      <div className="text-xs text-muted-foreground">{slot.teacher} • {slot.room}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Assignments */}
          <Card>
            <CardHeader className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  Upcoming Assignments
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Due soon</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                <Link to="/student/assignments">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-2 sm:space-y-3">
                {upcomingAssignments.map(assignment => (
                  <div key={assignment.id} className="flex items-start justify-between gap-2 rounded-lg border p-2.5 sm:items-center sm:p-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{assignment.title}</div>
                      <div className="text-xs text-muted-foreground">{assignment.subject}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant={assignment.status === 'in_progress' ? 'secondary' : 'outline'} className="text-xs">
                        {assignment.status === 'in_progress' ? 'In Progress' : 'Pending'}
                      </Badge>
                      <div className="text-[10px] text-muted-foreground mt-1 sm:text-xs">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Grades */}
          <Card>
            <CardHeader className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  Recent Grades
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your latest results</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                <Link to="/student/grades">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-2 sm:space-y-3">
                {recentGrades.map((grade, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 rounded-lg border p-2.5 sm:p-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{grade.subject}</div>
                      <div className="text-xs text-muted-foreground">{grade.exam}</div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <div className="w-16 sm:w-24 hidden xs:block">
                        <Progress value={grade.percentage} className="h-2" />
                      </div>
                      <Badge variant={grade.grade.startsWith('A') ? 'default' : 'secondary'} className="text-xs">
                        {grade.grade}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attendance Overview */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />
                Attendance This Month
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="grid grid-cols-4 gap-2 text-center sm:gap-4">
                <div className="rounded-lg bg-success/10 p-2 sm:p-4">
                  <div className="text-lg font-bold text-success sm:text-2xl">18</div>
                  <div className="text-[10px] text-muted-foreground sm:text-xs">Present</div>
                </div>
                <div className="rounded-lg bg-destructive/10 p-2 sm:p-4">
                  <div className="text-lg font-bold text-destructive sm:text-2xl">1</div>
                  <div className="text-[10px] text-muted-foreground sm:text-xs">Absent</div>
                </div>
                <div className="rounded-lg bg-warning/10 p-2 sm:p-4">
                  <div className="text-lg font-bold text-warning sm:text-2xl">2</div>
                  <div className="text-[10px] text-muted-foreground sm:text-xs">Late</div>
                </div>
                <div className="rounded-lg bg-info/10 p-2 sm:p-4">
                  <div className="text-lg font-bold text-info sm:text-2xl">1</div>
                  <div className="text-[10px] text-muted-foreground sm:text-xs">Excused</div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-3 sm:mt-4" size="sm" asChild>
                <Link to="/student/attendance">View Details</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
