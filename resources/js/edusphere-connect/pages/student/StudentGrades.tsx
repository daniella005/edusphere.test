import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, GraduationCap, Award, BookOpen } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface SubjectGrade {
  subject: string;
  code: string;
  credits: number;
  assignments: number;
  quizzes: number;
  midterm: number;
  final: number;
  overall: number;
  grade: string;
  gpa: number;
}

interface ExamResult {
  id: string;
  exam: string;
  subject: string;
  date: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  classAverage: number;
  rank: number;
}

const MOCK_GRADES: SubjectGrade[] = [
  { subject: 'Mathematics', code: 'MATH101', credits: 4, assignments: 92, quizzes: 88, midterm: 85, final: 90, overall: 89, grade: 'A', gpa: 4.0 },
  { subject: 'Physics', code: 'PHY101', credits: 4, assignments: 85, quizzes: 82, midterm: 78, final: 84, overall: 82, grade: 'B+', gpa: 3.3 },
  { subject: 'English Literature', code: 'ENG101', credits: 3, assignments: 90, quizzes: 92, midterm: 88, final: 91, overall: 90, grade: 'A-', gpa: 3.7 },
  { subject: 'Chemistry', code: 'CHM101', credits: 4, assignments: 78, quizzes: 80, midterm: 75, final: 82, overall: 79, grade: 'B', gpa: 3.0 },
  { subject: 'World History', code: 'HIS101', credits: 3, assignments: 95, quizzes: 90, midterm: 92, final: 94, overall: 93, grade: 'A', gpa: 4.0 },
  { subject: 'Computer Science', code: 'CS101', credits: 3, assignments: 88, quizzes: 85, midterm: 82, final: 87, overall: 86, grade: 'B+', gpa: 3.3 },
];

const MOCK_EXAMS: ExamResult[] = [
  { id: '1', exam: 'Midterm Examination', subject: 'Mathematics', date: '2024-01-15', marksObtained: 85, totalMarks: 100, percentage: 85, grade: 'A', classAverage: 72, rank: 5 },
  { id: '2', exam: 'Physics Quiz 3', subject: 'Physics', date: '2024-01-20', marksObtained: 22, totalMarks: 25, percentage: 88, grade: 'A', classAverage: 18, rank: 3 },
  { id: '3', exam: 'English Essay', subject: 'English Literature', date: '2024-01-25', marksObtained: 45, totalMarks: 50, percentage: 90, grade: 'A-', classAverage: 38, rank: 2 },
  { id: '4', exam: 'Chemistry Lab Test', subject: 'Chemistry', date: '2024-02-01', marksObtained: 38, totalMarks: 50, percentage: 76, grade: 'B', classAverage: 35, rank: 8 },
  { id: '5', exam: 'History Research Paper', subject: 'World History', date: '2024-02-05', marksObtained: 92, totalMarks: 100, percentage: 92, grade: 'A', classAverage: 75, rank: 1 },
];

const progressData = [
  { month: 'Sep', gpa: 3.5 },
  { month: 'Oct', gpa: 3.6 },
  { month: 'Nov', gpa: 3.7 },
  { month: 'Dec', gpa: 3.65 },
  { month: 'Jan', gpa: 3.75 },
];

const skillsData = [
  { subject: 'Math', score: 89 },
  { subject: 'Physics', score: 82 },
  { subject: 'English', score: 90 },
  { subject: 'Chemistry', score: 79 },
  { subject: 'History', score: 93 },
  { subject: 'CS', score: 86 },
];

export default function StudentGrades() {
  const [termFilter, setTermFilter] = useState('current');

  const totalCredits = MOCK_GRADES.reduce((a, g) => a + g.credits, 0);
  const weightedGPA = MOCK_GRADES.reduce((a, g) => a + g.gpa * g.credits, 0) / totalCredits;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="My Grades" description="View your academic performance and grades" />

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />Current GPA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{weightedGPA.toFixed(2)}</div>
              <div className="flex items-center text-sm text-success">
                <TrendingUp className="h-4 w-4 mr-1" />+0.15 from last term
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" />Credits Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCredits}</div>
              <div className="text-sm text-muted-foreground">This semester</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="h-4 w-4" />Class Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5<span className="text-lg text-muted-foreground">/38</span></div>
              <div className="text-sm text-muted-foreground">Top 15%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">86%</div>
              <Progress value={86} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Select value={termFilter} onValueChange={setTermFilter}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Term</SelectItem>
              <SelectItem value="fall2024">Fall 2024</SelectItem>
              <SelectItem value="spring2024">Spring 2024</SelectItem>
              <SelectItem value="all">All Terms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="subjects">
          <TabsList>
            <TabsTrigger value="subjects">By Subject</TabsTrigger>
            <TabsTrigger value="exams">Exam Results</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Grades</CardTitle>
                <CardDescription>Detailed breakdown by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Assignments</TableHead>
                      <TableHead>Quizzes</TableHead>
                      <TableHead>Midterm</TableHead>
                      <TableHead>Final</TableHead>
                      <TableHead>Overall</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_GRADES.map(grade => (
                      <TableRow key={grade.code}>
                        <TableCell>
                          <div className="font-medium">{grade.subject}</div>
                          <div className="text-sm text-muted-foreground">{grade.code}</div>
                        </TableCell>
                        <TableCell>{grade.credits}</TableCell>
                        <TableCell>{grade.assignments}%</TableCell>
                        <TableCell>{grade.quizzes}%</TableCell>
                        <TableCell>{grade.midterm}%</TableCell>
                        <TableCell>{grade.final}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={grade.overall} className="w-16 h-2" />
                            <span>{grade.overall}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={grade.grade.startsWith('A') ? 'default' : 'secondary'}>{grade.grade}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exams" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Exam Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Class Avg</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_EXAMS.map(exam => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.exam}</TableCell>
                        <TableCell>{exam.subject}</TableCell>
                        <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                        <TableCell>{exam.marksObtained}/{exam.totalMarks} ({exam.percentage}%)</TableCell>
                        <TableCell>{exam.classAverage}%</TableCell>
                        <TableCell>
                          <Badge variant="outline">#{exam.rank}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={exam.grade.startsWith('A') ? 'default' : 'secondary'}>{exam.grade}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>GPA Trend</CardTitle>
                  <CardDescription>Your GPA progress over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[3, 4]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="gpa" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Performance across subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={skillsData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
