import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatsCard } from '@/components/shared/StatsCard';
import { FormDialog } from '@/components/shared/FormDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, MessageSquare, Clock, CheckCircle2, AlertCircle, User, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Ticket {
  id: string;
  subject: string;
  schoolName: string;
  submittedBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  createdAt: string;
  updatedAt: string;
}

const MOCK_TICKETS: Ticket[] = [
  { id: 'TKT-001', subject: 'Unable to generate report cards', schoolName: 'Lincoln High School', submittedBy: 'John Admin', priority: 'high', status: 'open', category: 'Reports', createdAt: '2024-01-20 10:30', updatedAt: '2024-01-20 10:30' },
  { id: 'TKT-002', subject: 'Payment integration not working', schoolName: 'Oak Valley Academy', submittedBy: 'Sarah Finance', priority: 'urgent', status: 'in_progress', category: 'Payments', createdAt: '2024-01-19 15:45', updatedAt: '2024-01-20 09:00' },
  { id: 'TKT-003', subject: 'Need to reset admin password', schoolName: 'Riverside Elementary', submittedBy: 'Mike Support', priority: 'medium', status: 'resolved', category: 'Account', createdAt: '2024-01-18 11:20', updatedAt: '2024-01-19 14:30' },
  { id: 'TKT-004', subject: 'Question about bulk import', schoolName: 'Westfield Middle School', submittedBy: 'Emily HR', priority: 'low', status: 'closed', category: 'Data', createdAt: '2024-01-15 09:00', updatedAt: '2024-01-17 16:45' },
  { id: 'TKT-005', subject: 'Timetable conflicts not detected', schoolName: 'Summit Prep School', submittedBy: 'Jane Admin', priority: 'high', status: 'open', category: 'Academics', createdAt: '2024-01-20 08:15', updatedAt: '2024-01-20 08:15' },
];

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-destructive/10 text-destructive',
  urgent: 'bg-destructive text-destructive-foreground',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  open: <AlertCircle className="h-4 w-4 text-warning" />,
  in_progress: <Clock className="h-4 w-4 text-info" />,
  resolved: <CheckCircle2 className="h-4 w-4 text-success" />,
  closed: <CheckCircle2 className="h-4 w-4 text-muted-foreground" />,
};

export default function SupportTickets() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [search, setSearch] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.schoolName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedToday = tickets.filter(t => t.status === 'resolved' && t.updatedAt.includes('2024-01-20')).length;
  const avgResponseTime = '2.4 hrs';

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDetailOpen(true);
  };

  const handleUpdateStatus = (ticket: Ticket, newStatus: Ticket['status']) => {
    setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: newStatus, updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ') } : t));
    toast({ title: 'Status Updated', description: `Ticket ${ticket.id} is now ${newStatus.replace('_', ' ')}.` });
  };

  const handleSendReply = () => {
    if (!reply.trim()) return;
    toast({ title: 'Reply Sent', description: 'Your response has been sent to the school.' });
    setReply('');
  };

  const columns = [
    {
      key: 'id',
      label: 'Ticket',
      render: (ticket: Ticket) => (
        <div>
          <div className="font-medium">{ticket.id}</div>
          <div className="text-sm text-muted-foreground truncate max-w-[200px]">{ticket.subject}</div>
        </div>
      ),
    },
    { key: 'schoolName', label: 'School' },
    { key: 'category', label: 'Category' },
    {
      key: 'priority',
      label: 'Priority',
      render: (ticket: Ticket) => (
        <Badge variant="outline" className={PRIORITY_COLORS[ticket.priority]}>
          {ticket.priority.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (ticket: Ticket) => (
        <div className="flex items-center gap-2">
          {STATUS_ICONS[ticket.status]}
          <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
        </div>
      ),
    },
    { key: 'createdAt', label: 'Created' },
    {
      key: 'actions',
      label: '',
      render: (ticket: Ticket) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={() => handleViewTicket(ticket)}>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatus(ticket, 'in_progress')}>Mark In Progress</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatus(ticket, 'resolved')}>Mark Resolved</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatus(ticket, 'closed')}>Close Ticket</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Support Tickets"
          description="Manage and respond to school support requests"
        />

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard title="Open Tickets" value={openTickets} icon={AlertCircle} iconColor="text-warning" />
          <StatsCard title="In Progress" value={inProgressTickets} icon={Clock} iconColor="text-info" />
          <StatsCard title="Resolved Today" value={resolvedToday} icon={CheckCircle2} iconColor="text-success" />
          <StatsCard title="Avg Response Time" value={avgResponseTime} icon={MessageSquare} />
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={filteredTickets}
          searchPlaceholder="Search tickets..."
          searchValue={search}
          onSearchChange={setSearch}
        />

        <FormDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          title={selectedTicket?.id || ''}
          description={selectedTicket?.subject}
          size="lg"
        >
          {selectedTicket && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">School</Label>
                  <p className="font-medium">{selectedTicket.schoolName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Submitted By</Label>
                  <p className="font-medium">{selectedTicket.submittedBy}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Priority</Label>
                  <Badge variant="outline" className={PRIORITY_COLORS[selectedTicket.priority]}>
                    {selectedTicket.priority.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Select value={selectedTicket.status} onValueChange={(v: Ticket['status']) => handleUpdateStatus(selectedTicket, v)}>
                    <SelectTrigger className="w-40 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Ticket Description</Label>
                <Card className="mt-2">
                  <CardContent className="p-4">
                    <p className="text-sm">
                      We are experiencing issues with generating report cards for the current term. 
                      When we try to generate the PDF, the system shows an error message and the download fails. 
                      This is urgent as we need to distribute report cards to parents by end of week.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Label className="text-muted-foreground">Reply</Label>
                <Textarea
                  className="mt-2"
                  placeholder="Type your response..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  rows={4}
                />
                <Button className="mt-2" onClick={handleSendReply}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Reply
                </Button>
              </div>
            </div>
          )}
        </FormDialog>
      </div>
    </DashboardLayout>
  );
}
