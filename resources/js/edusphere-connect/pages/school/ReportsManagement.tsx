import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, BarChart3, Users, DollarSign, GraduationCap, ClipboardList, TrendingUp, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  { id: '1', name: 'Student Enrollment Report', description: 'Overview of student enrollment by class and section', category: 'Students', icon: Users },
  { id: '2', name: 'Attendance Summary', description: 'Monthly attendance statistics for students and staff', category: 'Attendance', icon: ClipboardList },
  { id: '3', name: 'Academic Performance', description: 'Grade distribution and performance analysis', category: 'Academics', icon: GraduationCap },
  { id: '4', name: 'Fee Collection Report', description: 'Fee collection status and pending dues', category: 'Finance', icon: DollarSign },
  { id: '5', name: 'Teacher Workload', description: 'Teaching hours and class assignments', category: 'Staff', icon: Users },
  { id: '6', name: 'Exam Results Summary', description: 'Term-wise exam results and analysis', category: 'Academics', icon: FileText },
];

const attendanceData = [
  { month: 'Sep', present: 95, absent: 5 },
  { month: 'Oct', present: 92, absent: 8 },
  { month: 'Nov', present: 94, absent: 6 },
  { month: 'Dec', present: 88, absent: 12 },
  { month: 'Jan', present: 93, absent: 7 },
];

const gradeDistribution = [
  { grade: 'A+', count: 45 },
  { grade: 'A', count: 78 },
  { grade: 'B+', count: 92 },
  { grade: 'B', count: 85 },
  { grade: 'C+', count: 56 },
  { grade: 'C', count: 34 },
  { grade: 'D', count: 18 },
  { grade: 'F', count: 8 },
];

const enrollmentByClass = [
  { name: 'Grade 9', value: 180, color: 'hsl(var(--primary))' },
  { name: 'Grade 10', value: 165, color: 'hsl(var(--secondary))' },
  { name: 'Grade 11', value: 142, color: 'hsl(var(--info))' },
  { name: 'Grade 12', value: 128, color: 'hsl(var(--warning))' },
];

const feeCollection = [
  { month: 'Sep', collected: 125000, pending: 15000 },
  { month: 'Oct', collected: 130000, pending: 12000 },
  { month: 'Nov', collected: 128000, pending: 18000 },
  { month: 'Dec', collected: 135000, pending: 10000 },
  { month: 'Jan', collected: 122000, pending: 25000 },
];

export default function ReportsManagement() {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('current-term');

  const handleGenerateReport = (report: ReportTemplate) => {
    toast({ title: 'Generating Report', description: `${report.name} is being generated...` });
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    toast({ title: 'Exporting', description: `Report will be downloaded as ${format.toUpperCase()}` });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Reports & Analytics" description="Generate reports and view analytics" />

        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-term">Current Term</SelectItem>
              <SelectItem value="last-term">Last Term</SelectItem>
              <SelectItem value="current-year">Current Year</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="mr-2 h-4 w-4" />Export Excel
          </Button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Enrollment by Class */}
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment by Class</CardTitle>
                  <CardDescription>Student distribution across classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={enrollmentByClass} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label>
                          {enrollmentByClass.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Attendance Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Trend</CardTitle>
                  <CardDescription>Monthly attendance percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[80, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="present" stroke="hsl(var(--primary))" strokeWidth={2} name="Present %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Student performance distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Students" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Analysis</CardTitle>
                <CardDescription>Present vs Absent comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" fill="hsl(var(--success))" stackId="a" name="Present %" />
                      <Bar dataKey="absent" fill="hsl(var(--destructive))" stackId="a" name="Absent %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Fee Collection</CardTitle>
                <CardDescription>Collected vs Pending fees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={feeCollection}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(v) => `$${v / 1000}k`} />
                      <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="collected" fill="hsl(var(--success))" name="Collected" />
                      <Bar dataKey="pending" fill="hsl(var(--warning))" name="Pending" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {REPORT_TEMPLATES.map(report => (
                <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleGenerateReport(report)}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <report.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{report.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">{report.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <Button className="mt-4 w-full" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />Generate Report
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
