import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Save, Upload, School, Bell, Lock, Palette, Globe, Mail } from 'lucide-react';

export default function SchoolSettings() {
  const { toast } = useToast();
  const { school } = useAuth();

  const [generalSettings, setGeneralSettings] = useState({
    name: school?.name || 'Springfield High School',
    code: school?.code || 'SHS',
    email: school?.email || 'info@springfield.edu',
    phone: school?.phone || '+1 (555) 123-4567',
    website: school?.website || 'https://springfield.edu',
    address: school?.address || '123 Education Lane, Springfield, IL 62701',
    motto: 'Excellence in Education',
    foundedYear: '1985',
  });

  const [academicSettings, setAcademicSettings] = useState({
    currentAcademicYear: '2024-2025',
    currentTerm: 'Spring',
    gradingSystem: 'letter',
    passingGrade: '60',
    attendanceThreshold: '75',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    attendanceAlerts: true,
    feeReminders: true,
    examNotifications: true,
    announcements: true,
  });

  const [moduleSettings, setModuleSettings] = useState({
    lms: true,
    transport: false,
    library: true,
    hr: true,
    inventory: false,
  });

  const handleSave = (section: string) => {
    toast({ title: 'Settings Saved', description: `${section} settings have been updated.` });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="School Settings" description="Configure school preferences and settings" />

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                  School Information
                </CardTitle>
                <CardDescription>Basic school details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{generalSettings.code}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline"><Upload className="mr-2 h-4 w-4" />Upload Logo</Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>School Name</Label>
                    <Input value={generalSettings.name} onChange={e => setGeneralSettings(s => ({ ...s, name: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>School Code</Label>
                    <Input value={generalSettings.code} onChange={e => setGeneralSettings(s => ({ ...s, code: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={generalSettings.email} onChange={e => setGeneralSettings(s => ({ ...s, email: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={generalSettings.phone} onChange={e => setGeneralSettings(s => ({ ...s, phone: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input value={generalSettings.website} onChange={e => setGeneralSettings(s => ({ ...s, website: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Founded Year</Label>
                    <Input value={generalSettings.foundedYear} onChange={e => setGeneralSettings(s => ({ ...s, foundedYear: e.target.value }))} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <Textarea value={generalSettings.address} onChange={e => setGeneralSettings(s => ({ ...s, address: e.target.value }))} rows={2} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>School Motto</Label>
                    <Input value={generalSettings.motto} onChange={e => setGeneralSettings(s => ({ ...s, motto: e.target.value }))} />
                  </div>
                </div>

                <Button onClick={() => handleSave('General')}><Save className="mr-2 h-4 w-4" />Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Settings</CardTitle>
                <CardDescription>Configure academic year, grading, and attendance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Current Academic Year</Label>
                    <Select value={academicSettings.currentAcademicYear} onValueChange={v => setAcademicSettings(s => ({ ...s, currentAcademicYear: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-2024">2023-2024</SelectItem>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                        <SelectItem value="2025-2026">2025-2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Term</Label>
                    <Select value={academicSettings.currentTerm} onValueChange={v => setAcademicSettings(s => ({ ...s, currentTerm: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fall">Fall</SelectItem>
                        <SelectItem value="Spring">Spring</SelectItem>
                        <SelectItem value="Summer">Summer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Grading System</Label>
                    <Select value={academicSettings.gradingSystem} onValueChange={v => setAcademicSettings(s => ({ ...s, gradingSystem: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="letter">Letter Grades (A-F)</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="gpa">GPA (0-4)</SelectItem>
                        <SelectItem value="points">Points Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Passing Grade (%)</Label>
                    <Input type="number" value={academicSettings.passingGrade} onChange={e => setAcademicSettings(s => ({ ...s, passingGrade: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Attendance (%)</Label>
                    <Input type="number" value={academicSettings.attendanceThreshold} onChange={e => setAcademicSettings(s => ({ ...s, attendanceThreshold: e.target.value }))} />
                  </div>
                </div>

                <Button onClick={() => handleSave('Academic')}><Save className="mr-2 h-4 w-4" />Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Configure how notifications are sent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via email</p>
                    </div>
                    <Switch checked={notificationSettings.emailNotifications} onCheckedChange={v => setNotificationSettings(s => ({ ...s, emailNotifications: v }))} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                    </div>
                    <Switch checked={notificationSettings.smsNotifications} onCheckedChange={v => setNotificationSettings(s => ({ ...s, smsNotifications: v }))} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Attendance Alerts</Label>
                      <p className="text-sm text-muted-foreground">Alert parents of student absence</p>
                    </div>
                    <Switch checked={notificationSettings.attendanceAlerts} onCheckedChange={v => setNotificationSettings(s => ({ ...s, attendanceAlerts: v }))} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Fee Reminders</Label>
                      <p className="text-sm text-muted-foreground">Send fee payment reminders</p>
                    </div>
                    <Switch checked={notificationSettings.feeReminders} onCheckedChange={v => setNotificationSettings(s => ({ ...s, feeReminders: v }))} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Exam Notifications</Label>
                      <p className="text-sm text-muted-foreground">Notify about upcoming exams and results</p>
                    </div>
                    <Switch checked={notificationSettings.examNotifications} onCheckedChange={v => setNotificationSettings(s => ({ ...s, examNotifications: v }))} />
                  </div>
                </div>

                <Button onClick={() => handleSave('Notifications')}><Save className="mr-2 h-4 w-4" />Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Module Configuration</CardTitle>
                <CardDescription>Enable or disable optional modules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { key: 'lms', label: 'Learning Management System', desc: 'Online courses, assignments, and materials' },
                    { key: 'transport', label: 'Transport Management', desc: 'Vehicle tracking and route management' },
                    { key: 'library', label: 'Library Management', desc: 'Book catalog and loan management' },
                    { key: 'hr', label: 'HR & Payroll', desc: 'Staff management and payroll processing' },
                    { key: 'inventory', label: 'Inventory Management', desc: 'Asset and consumable tracking' },
                  ].map(module => (
                    <div key={module.key} className="flex items-center justify-between">
                      <div>
                        <Label>{module.label}</Label>
                        <p className="text-sm text-muted-foreground">{module.desc}</p>
                      </div>
                      <Switch 
                        checked={moduleSettings[module.key as keyof typeof moduleSettings]} 
                        onCheckedChange={v => setModuleSettings(s => ({ ...s, [module.key]: v }))} 
                      />
                    </div>
                  ))}
                </div>

                <Button onClick={() => handleSave('Modules')}><Save className="mr-2 h-4 w-4" />Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Branding & Appearance
                </CardTitle>
                <CardDescription>Customize the look and feel of your school portal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="w-16 h-10" defaultValue="#1a4d5c" />
                      <Input defaultValue="#1a4d5c" className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="w-16 h-10" defaultValue="#2dd4bf" />
                      <Input defaultValue="#2dd4bf" className="flex-1" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Custom CSS (Advanced)</Label>
                  <Textarea placeholder="/* Add custom CSS here */" rows={4} className="font-mono text-sm" />
                </div>

                <Button onClick={() => handleSave('Branding')}><Save className="mr-2 h-4 w-4" />Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
