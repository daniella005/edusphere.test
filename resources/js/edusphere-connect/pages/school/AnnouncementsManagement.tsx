import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FormDialog } from '@/components/shared/FormDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Eye, Send, Megaphone, Bell, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'academic' | 'event' | 'urgent';
  audience: string[];
  publishDate: string;
  expiryDate?: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  views: number;
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: 'Winter Break Schedule', content: 'School will be closed from December 23rd to January 5th for winter break. Classes resume on January 6th.', type: 'general', audience: ['All'], publishDate: '2024-01-15', status: 'published', author: 'Principal', views: 1250 },
  { id: '2', title: 'Parent-Teacher Conference', content: 'Parent-teacher conferences will be held on February 10th. Please sign up for a slot using the parent portal.', type: 'event', audience: ['Parents', 'Teachers'], publishDate: '2024-01-20', status: 'published', author: 'Admin Office', views: 890 },
  { id: '3', title: 'Midterm Exam Schedule', content: 'Midterm examinations will commence from February 15th. Detailed schedule attached.', type: 'academic', audience: ['Students', 'Teachers', 'Parents'], publishDate: '2024-01-25', status: 'published', author: 'Academic Office', views: 2100 },
  { id: '4', title: 'Emergency: School Closure Tomorrow', content: 'Due to severe weather conditions, school will remain closed tomorrow. Online classes will be conducted instead.', type: 'urgent', audience: ['All'], publishDate: '2024-01-28', status: 'published', author: 'Principal', views: 3500 },
  { id: '5', title: 'Sports Day Announcement', content: 'Annual Sports Day will be held on March 15th. Students should register for events by February 28th.', type: 'event', audience: ['Students', 'Teachers'], publishDate: '2024-02-01', status: 'draft', author: 'Sports Department', views: 0 },
];

const TYPE_COLORS: Record<string, string> = {
  general: 'bg-secondary text-secondary-foreground',
  academic: 'bg-primary/10 text-primary',
  event: 'bg-info/10 text-info',
  urgent: 'bg-destructive text-destructive-foreground',
};

export default function AnnouncementsManagement() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null);

  const [formData, setFormData] = useState({
    title: '', content: '', type: 'general', audience: 'all', publishDate: '', sendNotification: true,
  });

  const handleCreate = () => {
    setEditingAnnouncement(null);
    setFormData({ title: '', content: '', type: 'general', audience: 'all', publishDate: '', sendNotification: true });
    setFormOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      audience: announcement.audience[0].toLowerCase(),
      publishDate: announcement.publishDate,
      sendNotification: false,
    });
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (editingAnnouncement) {
      setAnnouncements(prev => prev.map(a => a.id === editingAnnouncement.id ? { ...a, title: formData.title, content: formData.content, type: formData.type as Announcement['type'] } : a));
      toast({ title: 'Announcement Updated' });
    } else {
      const newAnnouncement: Announcement = {
        id: String(announcements.length + 1),
        title: formData.title,
        content: formData.content,
        type: formData.type as Announcement['type'],
        audience: formData.audience === 'all' ? ['All'] : [formData.audience],
        publishDate: formData.publishDate || new Date().toISOString().split('T')[0],
        status: 'published',
        author: 'Admin',
        views: 0,
      };
      setAnnouncements(prev => [...prev, newAnnouncement]);
      toast({ title: 'Announcement Published', description: formData.sendNotification ? 'Notifications sent to recipients.' : undefined });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deletingAnnouncement) {
      setAnnouncements(prev => prev.filter(a => a.id !== deletingAnnouncement.id));
      toast({ title: 'Announcement Deleted', variant: 'destructive' });
    }
    setDeleteOpen(false);
  };

  const columns = [
    {
      key: 'title',
      label: 'Announcement',
      render: (a: Announcement) => (
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Megaphone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{a.title}</div>
            <div className="text-sm text-muted-foreground line-clamp-1">{a.content}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (a: Announcement) => <Badge className={TYPE_COLORS[a.type]}>{a.type.charAt(0).toUpperCase() + a.type.slice(1)}</Badge>,
    },
    {
      key: 'audience',
      label: 'Audience',
      render: (a: Announcement) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{a.audience.join(', ')}</span>
        </div>
      ),
    },
    { key: 'publishDate', label: 'Published' },
    { key: 'views', label: 'Views', render: (a: Announcement) => a.views.toLocaleString() },
    {
      key: 'status',
      label: 'Status',
      render: (a: Announcement) => <StatusBadge status={a.status} />,
    },
    {
      key: 'actions',
      label: '',
      render: (announcement: Announcement) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />Preview</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(announcement)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
            <DropdownMenuItem><Send className="mr-2 h-4 w-4" />Resend</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setDeletingAnnouncement(announcement); setDeleteOpen(true); }} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Announcements" description="Create and manage school announcements" primaryAction={{ label: 'New Announcement', onClick: handleCreate }} />

        <DataTable columns={columns} data={announcements.filter(a => a.title.toLowerCase().includes(search.toLowerCase()))} searchPlaceholder="Search announcements..." searchValue={search} onSearchChange={setSearch} />

        <FormDialog open={formOpen} onOpenChange={setFormOpen} title={editingAnnouncement ? 'Edit Announcement' : 'New Announcement'} onSubmit={handleSubmit} submitLabel={editingAnnouncement ? 'Update' : 'Publish'} size="lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title" />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={formData.content} onChange={e => setFormData(p => ({ ...p, content: e.target.value }))} placeholder="Write your announcement..." rows={5} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={v => setFormData(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={formData.audience} onValueChange={v => setFormData(p => ({ ...p, audience: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="teachers">Teachers Only</SelectItem>
                    <SelectItem value="parents">Parents Only</SelectItem>
                    <SelectItem value="staff">Staff Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {!editingAnnouncement && (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Send Notification</Label>
                  <p className="text-sm text-muted-foreground">Send push/email notification to recipients</p>
                </div>
                <Switch checked={formData.sendNotification} onCheckedChange={v => setFormData(p => ({ ...p, sendNotification: v }))} />
              </div>
            )}
          </div>
        </FormDialog>

        <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Announcement" description={`Delete "${deletingAnnouncement?.title}"?`} confirmLabel="Delete" onConfirm={handleDelete} variant="destructive" />
      </div>
    </DashboardLayout>
  );
}
