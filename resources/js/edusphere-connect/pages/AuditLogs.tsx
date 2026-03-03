import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Download, Filter, Shield, User, Settings, Database, Key, AlertTriangle } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  details: string;
  severity: 'info' | 'warning' | 'error';
}

const MOCK_LOGS: AuditLog[] = [
  { id: '1', timestamp: '2024-01-20 10:45:23', user: 'john@eduplatform.com', userRole: 'Super Admin', action: 'UPDATE', resource: 'School', resourceId: 'school-001', ipAddress: '192.168.1.100', details: 'Updated school status to suspended', severity: 'warning' },
  { id: '2', timestamp: '2024-01-20 10:30:15', user: 'sarah@eduplatform.com', userRole: 'Support', action: 'VIEW', resource: 'Ticket', resourceId: 'TKT-002', ipAddress: '192.168.1.101', details: 'Viewed ticket details', severity: 'info' },
  { id: '3', timestamp: '2024-01-20 10:15:42', user: 'admin@lincoln.edu', userRole: 'School Admin', action: 'CREATE', resource: 'Student', resourceId: 'std-245', ipAddress: '203.45.67.89', details: 'Created new student record', severity: 'info' },
  { id: '4', timestamp: '2024-01-20 09:58:11', user: 'john@eduplatform.com', userRole: 'Super Admin', action: 'DELETE', resource: 'User', resourceId: 'usr-089', ipAddress: '192.168.1.100', details: 'Deleted user account', severity: 'error' },
  { id: '5', timestamp: '2024-01-20 09:45:33', user: 'mike@eduplatform.com', userRole: 'Analyst', action: 'EXPORT', resource: 'Report', resourceId: 'rpt-analytics', ipAddress: '192.168.1.102', details: 'Exported analytics data', severity: 'info' },
  { id: '6', timestamp: '2024-01-20 09:30:00', user: 'system', userRole: 'System', action: 'BACKUP', resource: 'Database', resourceId: 'backup-20240120', ipAddress: 'internal', details: 'Automated daily backup completed', severity: 'info' },
  { id: '7', timestamp: '2024-01-20 09:15:22', user: 'emily@eduplatform.com', userRole: 'Support', action: 'LOGIN_FAILED', resource: 'Auth', resourceId: '-', ipAddress: '192.168.1.103', details: 'Failed login attempt - invalid password', severity: 'warning' },
  { id: '8', timestamp: '2024-01-20 09:00:05', user: 'admin@oakvalley.edu', userRole: 'School Admin', action: 'UPDATE', resource: 'Settings', resourceId: 'school-002', ipAddress: '198.51.100.42', details: 'Modified fee structure', severity: 'info' },
];

const SEVERITY_STYLES: Record<string, string> = {
  info: 'bg-info/10 text-info',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-destructive/10 text-destructive',
};

const ACTION_ICONS: Record<string, React.ReactNode> = {
  CREATE: <Database className="h-4 w-4" />,
  UPDATE: <Settings className="h-4 w-4" />,
  DELETE: <AlertTriangle className="h-4 w-4" />,
  VIEW: <Shield className="h-4 w-4" />,
  EXPORT: <Download className="h-4 w-4" />,
  LOGIN_FAILED: <Key className="h-4 w-4" />,
  BACKUP: <Database className="h-4 w-4" />,
};

export default function AuditLogs() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  const filteredLogs = MOCK_LOGS.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    return matchesSearch && matchesAction && matchesSeverity;
  });

  const columns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (log: AuditLog) => (
        <span className="text-sm font-mono">{log.timestamp}</span>
      ),
    },
    {
      key: 'user',
      label: 'User',
      render: (log: AuditLog) => (
        <div>
          <div className="font-medium">{log.user}</div>
          <div className="text-xs text-muted-foreground">{log.userRole}</div>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (log: AuditLog) => (
        <div className="flex items-center gap-2">
          {ACTION_ICONS[log.action] || <Settings className="h-4 w-4" />}
          <span>{log.action}</span>
        </div>
      ),
    },
    {
      key: 'resource',
      label: 'Resource',
      render: (log: AuditLog) => (
        <div>
          <div>{log.resource}</div>
          <div className="text-xs text-muted-foreground font-mono">{log.resourceId}</div>
        </div>
      ),
    },
    {
      key: 'details',
      label: 'Details',
      render: (log: AuditLog) => (
        <span className="text-sm text-muted-foreground truncate max-w-[250px] block">{log.details}</span>
      ),
    },
    {
      key: 'severity',
      label: 'Severity',
      render: (log: AuditLog) => (
        <Badge variant="outline" className={SEVERITY_STYLES[log.severity]}>
          {log.severity.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      render: (log: AuditLog) => (
        <span className="text-sm font-mono text-muted-foreground">{log.ipAddress}</span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Audit Logs"
          description="Track all platform activities and security events"
          secondaryActions={[
            { label: 'Export Logs', onClick: () => {}, variant: 'outline' }
          ]}
        />

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Events Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">23</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">5</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Failed Logins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>

          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
              <SelectItem value="VIEW">View</SelectItem>
              <SelectItem value="EXPORT">Export</SelectItem>
              <SelectItem value="LOGIN_FAILED">Login Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={filteredLogs}
          searchPlaceholder="Search logs..."
          searchValue={search}
          onSearchChange={setSearch}
        />
      </div>
    </DashboardLayout>
  );
}
