import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const STATS = [
  {
    title: 'Total Schools',
    value: '147',
    change: '+12%',
    trend: 'up',
    icon: Building2,
    description: 'vs last month',
  },
  {
    title: 'Active Users',
    value: '24,521',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    description: 'across all schools',
  },
  {
    title: 'Monthly Revenue',
    value: '$128,400',
    change: '+23%',
    trend: 'up',
    icon: DollarSign,
    description: 'subscription income',
  },
  {
    title: 'Growth Rate',
    value: '18.2%',
    change: '-2.1%',
    trend: 'down',
    icon: TrendingUp,
    description: 'new school signups',
  },
];

const RECENT_SCHOOLS = [
  { id: '1', name: 'Lincoln High School', code: 'LHS', status: 'active', students: 1250, plan: 'Premium' },
  { id: '2', name: 'Oak Valley Academy', code: 'OVA', status: 'trial', students: 450, plan: 'Trial' },
  { id: '3', name: 'Riverside Elementary', code: 'RSE', status: 'active', students: 620, plan: 'Standard' },
  { id: '4', name: 'Summit Prep School', code: 'SPS', status: 'suspended', students: 380, plan: 'Premium' },
  { id: '5', name: 'Westfield Middle School', code: 'WMS', status: 'active', students: 890, plan: 'Standard' },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">Platform Dashboard</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Overview of all schools and platform metrics
            </p>
          </div>
          <Link to="/admin/schools/new">
            <Button size="sm" className="w-full sm:w-auto sm:h-10">
              <Plus className="mr-1.5 h-4 w-4 sm:mr-2" />
              Add School
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-3 grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            const isUp = stat.trend === 'up';
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 sm:p-6 sm:pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-lg font-bold sm:text-2xl">{stat.value}</div>
                  <div className="flex items-center text-[10px] sm:text-xs">
                    {isUp ? (
                      <ArrowUpRight className="mr-0.5 h-3 w-3 text-success sm:mr-1" />
                    ) : (
                      <ArrowDownRight className="mr-0.5 h-3 w-3 text-destructive sm:mr-1" />
                    )}
                    <span className={isUp ? 'text-success' : 'text-destructive'}>
                      {stat.change}
                    </span>
                    <span className="ml-1 text-muted-foreground hidden xs:inline">{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Schools Table */}
        <Card>
          <CardHeader className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <CardTitle className="text-base sm:text-lg">Recent Schools</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Latest school registrations and activity</CardDescription>
            </div>
            <Link to="/admin/schools">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground sm:text-sm">
                    <th className="p-3 font-medium sm:pb-3 sm:pt-0 sm:px-0">School</th>
                    <th className="p-3 font-medium sm:pb-3 sm:pt-0 sm:px-0 hidden sm:table-cell">Code</th>
                    <th className="p-3 font-medium sm:pb-3 sm:pt-0 sm:px-0">Status</th>
                    <th className="p-3 font-medium sm:pb-3 sm:pt-0 sm:px-0 hidden md:table-cell">Students</th>
                    <th className="p-3 font-medium sm:pb-3 sm:pt-0 sm:px-0 hidden lg:table-cell">Plan</th>
                    <th className="p-3 font-medium sm:pb-3 sm:pt-0 sm:px-0"></th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_SCHOOLS.map((school) => (
                    <tr key={school.id} className="border-b last:border-0">
                      <td className="p-3 text-sm font-medium sm:py-3 sm:px-0">{school.name}</td>
                      <td className="p-3 text-sm text-muted-foreground sm:py-3 sm:px-0 hidden sm:table-cell">{school.code}</td>
                      <td className="p-3 sm:py-3 sm:px-0">
                        <Badge
                          className="text-xs"
                          variant={
                            school.status === 'active'
                              ? 'default'
                              : school.status === 'trial'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {school.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground sm:py-3 sm:px-0 hidden md:table-cell">{school.students.toLocaleString()}</td>
                      <td className="p-3 text-sm text-muted-foreground sm:py-3 sm:px-0 hidden lg:table-cell">{school.plan}</td>
                      <td className="p-3 sm:py-3 sm:px-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
