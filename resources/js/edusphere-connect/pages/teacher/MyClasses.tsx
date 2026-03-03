import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Clock, TrendingUp, ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ClassInfo {
  id: string;
  name: string;
  section: string;
  subject: string;
  students: number;
  schedule: string[];
  room: string;
  averageGrade: number;
  attendanceRate: number;
}

const MOCK_CLASSES: ClassInfo[] = [
  { id: '1', name: 'Grade 10', section: 'A', subject: 'Mathematics', students: 38, schedule: ['Mon 08:00', 'Wed 09:40', 'Fri 08:00'], room: 'Room 101', averageGrade: 78, attendanceRate: 94 },
  { id: '2', name: 'Grade 10', section: 'B', subject: 'Mathematics', students: 35, schedule: ['Mon 08:50', 'Wed 10:40', 'Fri 08:50'], room: 'Room 101', averageGrade: 82, attendanceRate: 92 },
  { id: '3', name: 'Grade 11', section: 'A', subject: 'Mathematics', students: 32, schedule: ['Tue 09:40', 'Thu 08:00'], room: 'Room 102', averageGrade: 75, attendanceRate: 89 },
  { id: '4', name: 'Grade 9', section: 'A', subject: 'Algebra', students: 40, schedule: ['Mon 11:30', 'Wed 13:00'], room: 'Room 103', averageGrade: 80, attendanceRate: 96 },
  { id: '5', name: 'Grade 9', section: 'B', subject: 'Geometry', students: 38, schedule: ['Tue 13:00', 'Thu 11:30'], room: 'Room 103', averageGrade: 77, attendanceRate: 91 },
];

export default function MyClasses() {
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);

  const totalStudents = MOCK_CLASSES.reduce((acc, c) => acc + c.students, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="My Classes" description="View and manage your assigned classes" />

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Classes</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{MOCK_CLASSES.length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{totalStudents}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Avg. Performance</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">78%</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Avg. Attendance</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">92%</div></CardContent>
          </Card>
        </div>

        {/* Classes Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_CLASSES.map(cls => (
            <Card key={cls.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{cls.name} - {cls.section}</CardTitle>
                    <CardDescription>{cls.subject}</CardDescription>
                  </div>
                  <Badge variant="outline">{cls.room}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{cls.students} students</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Class Average</span>
                    <span className="font-medium">{cls.averageGrade}%</span>
                  </div>
                  <Progress value={cls.averageGrade} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Attendance Rate</span>
                    <span className="font-medium">{cls.attendanceRate}%</span>
                  </div>
                  <Progress value={cls.attendanceRate} className="h-2" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Schedule
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cls.schedule.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/teacher/attendance?class=${cls.id}`}>Attendance</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/teacher/gradebook?class=${cls.id}`}>Grades</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to={`/teacher/classes/${cls.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
