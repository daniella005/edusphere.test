import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/shared/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, BookOpen, ClipboardList, FileText, Calendar, Clock, TrendingUp, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TODAY_SCHEDULE = [
  { time: '08:00 - 08:45', subject: 'Mathematics', class: 'Grade 10 - A', room: 'Room 101' },
  { time: '08:50 - 09:35', subject: 'Mathematics', class: 'Grade 10 - B', room: 'Room 101' },
  { time: '09:40 - 10:25', subject: 'Mathematics', class: 'Grade 11 - A', room: 'Room 102' },
  { time: '11:30 - 12:15', subject: 'Algebra', class: 'Grade 9 - A', room: 'Room 103' },
  { time: '13:00 - 13:45', subject: 'Geometry', class: 'Grade 9 - B', room: 'Room 103' },
];

const PENDING_TASKS = [
  { id: '1', title: 'Grade Math Quiz - Grade 10A', due: 'Today', type: 'grading' },
  { id: '2', title: 'Submit Lesson Plan - Week 5', due: 'Tomorrow', type: 'lesson' },
  { id: '3', title: 'Mark Attendance - Grade 11A', due: 'Today', type: 'attendance' },
  { id: '4', title: 'Review Assignment Submissions', due: 'Feb 5', type: 'assignment' },
];

const RECENT_ANNOUNCEMENTS = [
  { id: '1', title: 'Parent-Teacher Meeting Schedule', date: 'Jan 28', type: 'event' },
  { id: '2', title: 'Midterm Exam Guidelines', date: 'Jan 25', type: 'academic' },
];

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader 
          title={`Good Morning, ${user?.firstName || 'Teacher'}!`} 
          description="Here's your schedule and tasks for today"
        />

        {/* Stats Cards */}
        <div className="grid gap-3 grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <StatsCard title="My Classes" value="5" icon={Users} description="Active classes" />
          <StatsCard title="Total Students" value="156" icon={BookOpen} description="Across all classes" />
          <StatsCard title="Pending Grades" value="23" icon={ClipboardList} description="Assignments to grade" />
          <StatsCard title="Avg. Performance" value="78%" icon={TrendingUp} description="Class average" />
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                    Today's Schedule
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Your classes for today</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">View Full Timetable</Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-2 sm:space-y-3">
                {TODAY_SCHEDULE.map((slot, index) => (
                  <div key={index} className="flex flex-col gap-2 rounded-lg border p-2.5 sm:flex-row sm:items-center sm:gap-4 sm:p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground sm:min-w-[120px] sm:text-sm">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {slot.time}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium sm:text-base">{slot.subject}</div>
                      <div className="text-xs text-muted-foreground sm:text-sm">{slot.class}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{slot.room}</Badge>
                      <Button size="sm" className="h-7 text-xs sm:h-9 sm:text-sm">Start</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                Pending Tasks
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Tasks requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-2 sm:space-y-3">
                {PENDING_TASKS.map(task => (
                  <div key={task.id} className="flex items-start gap-2 rounded-lg border p-2.5 sm:gap-3 sm:p-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium sm:text-sm truncate">{task.title}</div>
                      <div className="text-[10px] text-muted-foreground sm:text-xs">Due: {task.due}</div>
                    </div>
                    <Badge variant={task.due === 'Today' ? 'destructive' : 'secondary'} className="text-[10px] sm:text-xs shrink-0">
                      {task.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="grid gap-2 sm:gap-3 md:grid-cols-2">
              {RECENT_ANNOUNCEMENTS.map(ann => (
                <div key={ann.id} className="flex items-center gap-2 rounded-lg border p-2.5 sm:gap-3 sm:p-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{ann.title}</div>
                    <div className="text-xs text-muted-foreground">{ann.date}</div>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">{ann.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
