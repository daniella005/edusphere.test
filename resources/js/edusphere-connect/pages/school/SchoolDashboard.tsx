import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const STATS = [
  { title: 'Total Students', value: '1,247', icon: Users, color: 'text-primary' },
  { title: 'Teachers', value: '89', icon: GraduationCap, color: 'text-secondary' },
  { title: 'Courses', value: '156', icon: BookOpen, color: 'text-info' },
  { title: 'Events Today', value: '8', icon: Calendar, color: 'text-warning' },
];

const QUICK_STATS = [
  { label: 'Attendance Today', value: 94, status: 'good' },
  { label: 'Fee Collection', value: 78, status: 'warning' },
  { label: 'Assignment Submissions', value: 86, status: 'good' },
  { label: 'Exam Completion', value: 92, status: 'good' },
];

const RECENT_ACTIVITIES = [
  { id: 1, type: 'attendance', message: 'Class 10-A attendance marked', time: '5 min ago', icon: CheckCircle2 },
  { id: 2, type: 'fee', message: 'Fee payment received from John Doe', time: '15 min ago', icon: TrendingUp },
  { id: 3, type: 'event', message: 'Parent-Teacher meeting scheduled', time: '1 hour ago', icon: Calendar },
  { id: 4, type: 'alert', message: '3 students absent for 3+ days', time: '2 hours ago', icon: AlertCircle },
];

const UPCOMING_EVENTS = [
  { id: 1, title: 'Parent-Teacher Meeting', date: 'Today, 3:00 PM', type: 'meeting' },
  { id: 2, title: 'Science Fair', date: 'Tomorrow, 9:00 AM', type: 'event' },
  { id: 3, title: 'Mid-Term Exams Begin', date: 'Jan 25, 2024', type: 'exam' },
  { id: 4, title: 'Sports Day', date: 'Feb 2, 2024', type: 'event' },
];

export default function SchoolDashboard() {
  const { user, school } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Here's what's happening at {school?.name} today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-3 grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 sm:p-6 sm:pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-lg font-bold sm:text-2xl">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats & Progress */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Today's Overview</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Key metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0 sm:space-y-4 sm:p-6 sm:pt-0">
              {QUICK_STATS.map((stat) => (
                <div key={stat.label} className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span>{stat.label}</span>
                    <span className="font-medium">{stat.value}%</span>
                  </div>
                  <Progress
                    value={stat.value}
                    className={
                      stat.status === 'good'
                        ? '[&>div]:bg-success'
                        : stat.status === 'warning'
                        ? '[&>div]:bg-warning'
                        : '[&>div]:bg-destructive'
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-3 sm:space-y-4">
                {RECENT_ACTIVITIES.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-2.5 sm:gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted sm:h-8 sm:w-8">
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm truncate">{activity.message}</p>
                        <p className="text-[10px] text-muted-foreground sm:text-xs">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Upcoming Events</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Scheduled activities and important dates</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="grid gap-3 grid-cols-1 xs:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {UPCOMING_EVENTS.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border p-3 transition-colors hover:bg-muted/50 sm:p-4"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
                    <span className="text-[10px] text-muted-foreground sm:text-xs">{event.date}</span>
                  </div>
                  <p className="mt-1.5 text-sm font-medium sm:mt-2">{event.title}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
