import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormDialog } from '@/components/shared/FormDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Period {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

interface DaySchedule {
  day: string;
  periods: Period[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['08:00-08:45', '08:50-09:35', '09:40-10:25', '10:40-11:25', '11:30-12:15', '13:00-13:45', '13:50-14:35', '14:40-15:25'];

const MOCK_SCHEDULE: DaySchedule[] = DAYS.map(day => ({
  day,
  periods: [
    { id: '1', time: '08:00-08:45', subject: 'Mathematics', teacher: 'Sarah Williams', room: 'Room 101' },
    { id: '2', time: '08:50-09:35', subject: 'English', teacher: 'Jennifer Davis', room: 'Room 102' },
    { id: '3', time: '09:40-10:25', subject: 'Physics', teacher: 'Michael Brown', room: 'Lab 1' },
    { id: '4', time: '10:40-11:25', subject: 'History', teacher: 'Robert Miller', room: 'Room 103' },
    { id: '5', time: '11:30-12:15', subject: 'Computer Science', teacher: 'Emily Anderson', room: 'Computer Lab' },
    { id: '6', time: '13:00-13:45', subject: 'Chemistry', teacher: 'Michael Brown', room: 'Lab 2' },
    { id: '7', time: '13:50-14:35', subject: 'Physical Education', teacher: 'Coach Smith', room: 'Gym' },
    { id: '8', time: '14:40-15:25', subject: 'Art', teacher: 'Lisa Garcia', room: 'Art Room' },
  ].map((p, i) => ({ ...p, id: `${day}-${i}` })),
}));

const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
  'English': 'bg-green-100 text-green-800 border-green-200',
  'Physics': 'bg-purple-100 text-purple-800 border-purple-200',
  'Chemistry': 'bg-pink-100 text-pink-800 border-pink-200',
  'History': 'bg-amber-100 text-amber-800 border-amber-200',
  'Computer Science': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Physical Education': 'bg-orange-100 text-orange-800 border-orange-200',
  'Art': 'bg-rose-100 text-rose-800 border-rose-200',
};

export default function TimetableManagement() {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('Grade 10 - A');
  const [viewMode, setViewMode] = useState<'class' | 'teacher'>('class');
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    day: '', time: '', subject: '', teacher: '', room: '',
  });

  const handleAddPeriod = () => {
    toast({ title: 'Period Added', description: 'Timetable has been updated.' });
    setFormOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Timetable" 
          description="Manage class schedules and timetables"
          primaryAction={{ label: 'Add Period', onClick: () => setFormOpen(true) }}
        />

        <div className="flex flex-wrap items-center gap-4">
          <Select value={viewMode} onValueChange={(v: 'class' | 'teacher') => setViewMode(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="class">By Class</SelectItem>
              <SelectItem value="teacher">By Teacher</SelectItem>
            </SelectContent>
          </Select>

          {viewMode === 'class' ? (
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Grade 9 - A">Grade 9 - A</SelectItem>
                <SelectItem value="Grade 9 - B">Grade 9 - B</SelectItem>
                <SelectItem value="Grade 10 - A">Grade 10 - A</SelectItem>
                <SelectItem value="Grade 10 - B">Grade 10 - B</SelectItem>
                <SelectItem value="Grade 11 - A">Grade 11 - A</SelectItem>
                <SelectItem value="Grade 12 - A">Grade 12 - A</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sarah">Sarah Williams</SelectItem>
                <SelectItem value="michael">Michael Brown</SelectItem>
                <SelectItem value="jennifer">Jennifer Davis</SelectItem>
                <SelectItem value="robert">Robert Miller</SelectItem>
                <SelectItem value="emily">Emily Anderson</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Timetable Grid */}
        <Card>
          <CardHeader>
            <CardTitle>{selectedClass} - Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-3 bg-muted text-left min-w-[100px]">
                      <Clock className="h-4 w-4 inline mr-2" />Time
                    </th>
                    {DAYS.map(day => (
                      <th key={day} className="border p-3 bg-muted text-center min-w-[150px]">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIMES.map((time, timeIndex) => (
                    <tr key={time}>
                      <td className="border p-2 text-sm font-medium bg-muted/50">{time}</td>
                      {MOCK_SCHEDULE.map(daySchedule => {
                        const period = daySchedule.periods[timeIndex];
                        return (
                          <td key={`${daySchedule.day}-${time}`} className="border p-1">
                            {period && (
                              <div className={`rounded-md border p-2 text-xs ${SUBJECT_COLORS[period.subject] || 'bg-gray-100'}`}>
                                <div className="font-semibold">{period.subject}</div>
                                <div className="text-muted-foreground mt-1">{period.teacher}</div>
                                <div className="text-muted-foreground">{period.room}</div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subject Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SUBJECT_COLORS).map(([subject, color]) => (
                <Badge key={subject} variant="outline" className={color}>{subject}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Period Form */}
        <FormDialog open={formOpen} onOpenChange={setFormOpen} title="Add Period" onSubmit={handleAddPeriod}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Day</Label>
              <Select value={formData.day} onValueChange={v => setFormData(p => ({ ...p, day: v }))}>
                <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
                <SelectContent>
                  {DAYS.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time Slot</Label>
              <Select value={formData.time} onValueChange={v => setFormData(p => ({ ...p, time: v }))}>
                <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                <SelectContent>
                  {TIMES.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={formData.subject} onValueChange={v => setFormData(p => ({ ...p, subject: v }))}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Teacher</Label>
              <Select value={formData.teacher} onValueChange={v => setFormData(p => ({ ...p, teacher: v }))}>
                <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Williams">Sarah Williams</SelectItem>
                  <SelectItem value="Michael Brown">Michael Brown</SelectItem>
                  <SelectItem value="Jennifer Davis">Jennifer Davis</SelectItem>
                  <SelectItem value="Robert Miller">Robert Miller</SelectItem>
                  <SelectItem value="Emily Anderson">Emily Anderson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Room</Label>
              <Input value={formData.room} onChange={e => setFormData(p => ({ ...p, room: e.target.value }))} placeholder="e.g., Room 101" />
            </div>
          </div>
        </FormDialog>
      </div>
    </DashboardLayout>
  );
}
