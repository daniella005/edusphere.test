import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/shared/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Building2, Users, DollarSign, TrendingUp, Activity, Globe, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 98000, schools: 125 },
  { month: 'Feb', revenue: 105000, schools: 130 },
  { month: 'Mar', revenue: 112000, schools: 135 },
  { month: 'Apr', revenue: 108000, schools: 138 },
  { month: 'May', revenue: 118000, schools: 142 },
  { month: 'Jun', revenue: 128000, schools: 147 },
];

const userGrowthData = [
  { month: 'Jan', students: 18500, teachers: 1200, staff: 450 },
  { month: 'Feb', students: 19200, teachers: 1280, staff: 465 },
  { month: 'Mar', students: 20100, teachers: 1350, staff: 480 },
  { month: 'Apr', students: 21500, teachers: 1420, staff: 495 },
  { month: 'May', students: 22800, teachers: 1500, staff: 520 },
  { month: 'Jun', revenue: 24500, teachers: 1580, staff: 545 },
];

const planDistribution = [
  { name: 'Trial', value: 15, color: 'hsl(var(--muted))' },
  { name: 'Standard', value: 45, color: 'hsl(var(--secondary))' },
  { name: 'Premium', value: 32, color: 'hsl(var(--primary))' },
  { name: 'Enterprise', value: 8, color: 'hsl(var(--info))' },
];

const moduleUsage = [
  { module: 'Attendance', usage: 95 },
  { module: 'Exams', usage: 88 },
  { module: 'Fees', usage: 82 },
  { module: 'LMS', usage: 75 },
  { module: 'Library', usage: 68 },
  { module: 'Transport', usage: 45 },
];

const regionData = [
  { region: 'North America', schools: 68, revenue: 72000 },
  { region: 'Europe', schools: 42, revenue: 38000 },
  { region: 'Asia Pacific', schools: 25, revenue: 15000 },
  { region: 'Latin America', schools: 8, revenue: 3000 },
  { region: 'Africa', schools: 4, revenue: 400 },
];

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Platform Analytics"
            description="Monitor platform performance and usage metrics"
          />
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Schools" value="147" icon={Building2} trend={{ value: '+12', direction: 'up' }} description="this month" />
          <StatsCard title="Active Users" value="24,521" icon={Users} trend={{ value: '+8.2%', direction: 'up' }} description="growth rate" />
          <StatsCard title="Monthly Revenue" value="$128,400" icon={DollarSign} trend={{ value: '+23%', direction: 'up' }} description="vs last month" />
          <StatsCard title="Avg. Session" value="18.5 min" icon={Activity} trend={{ value: '+3.2%', direction: 'up' }} description="per user" />
        </div>

        <Tabs defaultValue="revenue">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Revenue Over Time</CardTitle>
                  <CardDescription>Monthly revenue trend</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(v) => `$${v / 1000}k`} />
                        <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
                        <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan Distribution</CardTitle>
                  <CardDescription>Schools by subscription plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={planDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label>
                          {planDistribution.map((entry, index) => (
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
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Region</CardTitle>
                <CardDescription>Geographic distribution of revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tickFormatter={(v) => `$${v / 1000}k`} />
                      <YAxis type="category" dataKey="region" width={100} className="text-xs" />
                      <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>User acquisition over time by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="students" stroke="hsl(var(--primary))" strokeWidth={2} />
                      <Line type="monotone" dataKey="teachers" stroke="hsl(var(--secondary))" strokeWidth={2} />
                      <Line type="monotone" dataKey="staff" stroke="hsl(var(--info))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schools" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Schools by Region</CardTitle>
                <CardDescription>Geographic distribution of schools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="schools" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Module Usage</CardTitle>
                <CardDescription>Percentage of schools using each module</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={moduleUsage} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <YAxis type="category" dataKey="module" width={100} />
                      <Tooltip formatter={(v) => [`${v}%`, 'Usage']} />
                      <Bar dataKey="usage" fill="hsl(var(--info))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
