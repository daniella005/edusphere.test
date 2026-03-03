import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, MapPin, User, Calendar } from 'lucide-react';

interface Period {
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type: 'class' | 'lab' | 'break' | 'lunch';
}

interface DaySchedule {
  day: string;
  periods: Period[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const SCHEDULE: DaySchedule[] = [
  {
    day: 'Monday',
    periods: [
      { time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Sarah Williams', room: 'Room 101', type: 'class' },
      { time: '08:50 - 09:35', subject: 'English', teacher: 'Jennifer Davis', room: 'Room 102', type: 'class' },
      { time: '09:40 - 10:25', subject: 'Physics', teacher: 'Michael Brown', room: 'Lab 1', type: 'lab' },
      { time: '10:25 - 10:40', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:40 - 11:25', subject: 'History', teacher: 'Robert Miller', room: 'Room 103', type: 'class' },
      { time: '11:30 - 12:15', subject: 'Computer Science', teacher: 'Emily Anderson', room: 'Computer Lab', type: 'lab' },
      { time: '12:15 - 13:00', subject: 'Lunch', teacher: '', room: 'Cafeteria', type: 'lunch' },
      { time: '13:00 - 13:45', subject: 'Chemistry', teacher: 'Lisa Garcia', room: 'Lab 2', type: 'lab' },
      { time: '13:50 - 14:35', subject: 'Physical Education', teacher: 'Coach Smith', room: 'Gym', type: 'class' },
    ],
  },
  {
    day: 'Tuesday',
    periods: [
      { time: '08:00 - 08:45', subject: 'Physics', teacher: 'Michael Brown', room: 'Room 104', type: 'class' },
      { time: '08:50 - 09:35', subject: 'Mathematics', teacher: 'Sarah Williams', room: 'Room 101', type: 'class' },
      { time: '09:40 - 10:25', subject: 'Chemistry', teacher: 'Lisa Garcia', room: 'Lab 2', type: 'lab' },
      { time: '10:25 - 10:40', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:40 - 11:25', subject: 'English', teacher: 'Jennifer Davis', room: 'Room 102', type: 'class' },
      { time: '11:30 - 12:15', subject: 'History', teacher: 'Robert Miller', room: 'Room 103', type: 'class' },
      { time: '12:15 - 13:00', subject: 'Lunch', teacher: '', room: 'Cafeteria', type: 'lunch' },
      { time: '13:00 - 13:45', subject: 'Computer Science', teacher: 'Emily Anderson', room: 'Computer Lab', type: 'lab' },
      { time: '13:50 - 14:35', subject: 'Art', teacher: 'Maria Rodriguez', room: 'Art Room', type: 'class' },
    ],
  },
  {
    day: 'Wednesday',
    periods: [
      { time: '08:00 - 08:45', subject: 'English', teacher: 'Jennifer Davis', room: 'Room 102', type: 'class' },
      { time: '08:50 - 09:35', subject: 'Chemistry', teacher: 'Lisa Garcia', room: 'Room 104', type: 'class' },
      { time: '09:40 - 10:25', subject: 'Mathematics', teacher: 'Sarah Williams', room: 'Room 101', type: 'class' },
      { time: '10:25 - 10:40', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:40 - 11:25', subject: 'Physics Lab', teacher: 'Michael Brown', room: 'Lab 1', type: 'lab' },
      { time: '11:30 - 12:15', subject: 'Physics Lab', teacher: 'Michael Brown', room: 'Lab 1', type: 'lab' },
      { time: '12:15 - 13:00', subject: 'Lunch', teacher: '', room: 'Cafeteria', type: 'lunch' },
      { time: '13:00 - 13:45', subject: 'History', teacher: 'Robert Miller', room: 'Room 103', type: 'class' },
      { time: '13:50 - 14:35', subject: 'Music', teacher: 'David Lee', room: 'Music Room', type: 'class' },
    ],
  },
  {
    day: 'Thursday',
    periods: [
      { time: '08:00 - 08:45', subject: 'Computer Science', teacher: 'Emily Anderson', room: 'Computer Lab', type: 'lab' },
      { time: '08:50 - 09:35', subject: 'Physics', teacher: 'Michael Brown', room: 'Room 104', type: 'class' },
      { time: '09:40 - 10:25', subject: 'English', teacher: 'Jennifer Davis', room: 'Room 102', type: 'class' },
      { time: '10:25 - 10:40', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:40 - 11:25', subject: 'Mathematics', teacher: 'Sarah Williams', room: 'Room 101', type: 'class' },
      { time: '11:30 - 12:15', subject: 'Chemistry Lab', teacher: 'Lisa Garcia', room: 'Lab 2', type: 'lab' },
      { time: '12:15 - 13:00', subject: 'Lunch', teacher: '', room: 'Cafeteria', type: 'lunch' },
      { time: '13:00 - 13:45', subject: 'Chemistry Lab', teacher: 'Lisa Garcia', room: 'Lab 2', type: 'lab' },
      { time: '13:50 - 14:35', subject: 'Physical Education', teacher: 'Coach Smith', room: 'Field', type: 'class' },
    ],
  },
  {
    day: 'Friday',
    periods: [
      { time: '08:00 - 08:45', subject: 'History', teacher: 'Robert Miller', room: 'Room 103', type: 'class' },
      { time: '08:50 - 09:35', subject: 'Mathematics', teacher: 'Sarah Williams', room: 'Room 101', type: 'class' },
      { time: '09:40 - 10:25', subject: 'English', teacher: 'Jennifer Davis', room: 'Room 102', type: 'class' },
      { time: '10:25 - 10:40', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:40 - 11:25', subject: 'Physics', teacher: 'Michael Brown', room: 'Room 104', type: 'class' },
      { time: '11:30 - 12:15', subject: 'Computer Science', teacher: 'Emily Anderson', room: 'Computer Lab', type: 'lab' },
      { time: '12:15 - 13:00', subject: 'Lunch', teacher: '', room: 'Cafeteria', type: 'lunch' },
      { time: '13:00 - 13:45', subject: 'Chemistry', teacher: 'Lisa Garcia', room: 'Room 104', type: 'class' },
      { time: '13:50 - 14:35', subject: 'Club Activities', teacher: '', room: 'Various', type: 'class' },
    ],
  },
];

const TYPE_STYLES = {
  class: 'bg-primary/10 border-primary/30',
  lab: 'bg-info/10 border-info/30',
  break: 'bg-muted border-muted-foreground/20',
  lunch: 'bg-warning/10 border-warning/30',
};

const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
const todaySchedule = SCHEDULE.find(s => s.day === today) || SCHEDULE[0];

export default function StudentTimetable() {
  const [view, setView] = useState<'today' | 'week'>('today');

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader title="My Timetable" description="View your class schedule" />

        <Tabs value={view} onValueChange={(v) => setView(v as 'today' | 'week')}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="today" className="flex-1 sm:flex-none text-xs sm:text-sm">Today</TabsTrigger>
            <TabsTrigger value="week" className="flex-1 sm:flex-none text-xs sm:text-sm">Weekly</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {todaySchedule.day}, {new Date().toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaySchedule.periods.map((period, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-4 rounded-lg border p-4 ${TYPE_STYLES[period.type]}`}
                    >
                      <div className="w-32 shrink-0">
                        <div className="flex items-center gap-2 font-medium">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {period.time}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-lg">{period.subject}</div>
                        {period.type !== 'break' && period.type !== 'lunch' && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />{period.teacher}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />{period.room}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="capitalize">{period.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="week" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[800px]">
                    <thead>
                      <tr>
                        <th className="border p-3 bg-muted text-left w-28">Time</th>
                        {DAYS.map(day => (
                          <th key={day} className={`border p-3 bg-muted text-center ${day === today ? 'bg-primary/10' : ''}`}>
                            {day}
                            {day === today && <Badge className="ml-2" variant="secondary">Today</Badge>}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SCHEDULE[0].periods.map((_, periodIndex) => (
                        <tr key={periodIndex}>
                          <td className="border p-2 text-sm font-medium bg-muted/50">
                            {SCHEDULE[0].periods[periodIndex].time}
                          </td>
                          {SCHEDULE.map(daySchedule => {
                            const period = daySchedule.periods[periodIndex];
                            return (
                              <td key={daySchedule.day} className={`border p-1 ${daySchedule.day === today ? 'bg-primary/5' : ''}`}>
                                <div className={`rounded p-2 text-xs ${TYPE_STYLES[period.type]}`}>
                                  <div className="font-semibold">{period.subject}</div>
                                  {period.type !== 'break' && period.type !== 'lunch' && (
                                    <>
                                      <div className="text-muted-foreground mt-1">{period.teacher}</div>
                                      <div className="text-muted-foreground">{period.room}</div>
                                    </>
                                  )}
                                </div>
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
            <Card className="mt-4">
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center gap-2"><div className={`w-4 h-4 rounded ${TYPE_STYLES.class}`} />Regular Class</div>
                  <div className="flex items-center gap-2"><div className={`w-4 h-4 rounded ${TYPE_STYLES.lab}`} />Lab Session</div>
                  <div className="flex items-center gap-2"><div className={`w-4 h-4 rounded ${TYPE_STYLES.break}`} />Break</div>
                  <div className="flex items-center gap-2"><div className={`w-4 h-4 rounded ${TYPE_STYLES.lunch}`} />Lunch</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
