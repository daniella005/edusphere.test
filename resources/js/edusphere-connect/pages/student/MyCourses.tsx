import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookOpen, Clock, Users, FileText, Video, Download } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  code: string;
  teacher: string;
  schedule: string;
  room: string;
  progress: number;
  grade: string;
  credits: number;
  materials: number;
  assignments: number;
}

const MOCK_COURSES: Course[] = [
  { id: '1', name: 'Mathematics', code: 'MATH101', teacher: 'Sarah Williams', schedule: 'Mon, Wed, Fri 08:00', room: 'Room 101', progress: 75, grade: 'A', credits: 4, materials: 12, assignments: 8 },
  { id: '2', name: 'Physics', code: 'PHY101', teacher: 'Michael Brown', schedule: 'Tue, Thu 09:00', room: 'Lab 1', progress: 68, grade: 'B+', credits: 4, materials: 15, assignments: 6 },
  { id: '3', name: 'English Literature', code: 'ENG101', teacher: 'Jennifer Davis', schedule: 'Mon, Wed 10:00', room: 'Room 102', progress: 82, grade: 'A-', credits: 3, materials: 20, assignments: 10 },
  { id: '4', name: 'Chemistry', code: 'CHM101', teacher: 'Lisa Garcia', schedule: 'Tue, Thu 11:00', room: 'Lab 2', progress: 60, grade: 'B', credits: 4, materials: 18, assignments: 7 },
  { id: '5', name: 'World History', code: 'HIS101', teacher: 'Robert Miller', schedule: 'Mon, Wed, Fri 14:00', room: 'Room 103', progress: 90, grade: 'A', credits: 3, materials: 25, assignments: 5 },
  { id: '6', name: 'Computer Science', code: 'CS101', teacher: 'Emily Anderson', schedule: 'Tue, Thu 14:00', room: 'Computer Lab', progress: 55, grade: 'B+', credits: 3, materials: 10, assignments: 12 },
];

export default function MyCourses() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader title="My Courses" description="View your enrolled courses and materials" />

        <div className="grid gap-3 grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <Card>
            <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Total Courses</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="text-lg font-bold sm:text-2xl">{MOCK_COURSES.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Total Credits</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="text-lg font-bold sm:text-2xl">{MOCK_COURSES.reduce((a, c) => a + c.credits, 0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Avg Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="text-lg font-bold sm:text-2xl">{Math.round(MOCK_COURSES.reduce((a, c) => a + c.progress, 0) / MOCK_COURSES.length)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Current GPA</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="text-lg font-bold sm:text-2xl">3.75</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_COURSES.map(course => (
            <Card key={course.id} className="overflow-hidden">
              <div className="h-2 bg-primary" />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <CardDescription>{course.code}</CardDescription>
                  </div>
                  <Badge variant={course.grade.startsWith('A') ? 'default' : 'secondary'}>{course.grade}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{course.teacher.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{course.teacher}</div>
                    <div className="text-xs text-muted-foreground">{course.schedule}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <span className="text-xs">Materials</span>
                    </div>
                    <div className="font-medium">{course.materials}</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">Tasks</span>
                    </div>
                    <div className="font-medium">{course.assignments}</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      <span className="text-xs">Credits</span>
                    </div>
                    <div className="font-medium">{course.credits}</div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <Video className="mr-2 h-4 w-4" />
                  Enter Course
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
