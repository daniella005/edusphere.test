import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Save, Mail, Bell, Shield, Database, Globe, Palette } from 'lucide-react';

export default function PlatformSettings() {
  const { toast } = useToast();

  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'EduPlatform',
    supportEmail: 'support@eduplatform.com',
    defaultTimezone: 'America/New_York',
    defaultLanguage: 'en',
    maintenanceMode: false,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.eduplatform.com',
    smtpPort: '587',
    smtpUser: 'noreply@eduplatform.com',
    fromName: 'EduPlatform',
    fromEmail: 'noreply@eduplatform.com',
  });

  const [securitySettings, setSecuritySettings] = useState({
    requireMfa: false,
    sessionTimeout: '60',
    maxLoginAttempts: '5',
    passwordMinLength: '8',
    requireSpecialChar: true,
    requireUppercase: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNewSchool: true,
    emailPaymentReceived: true,
    emailTicketCreated: true,
    emailSubscriptionExpiring: true,
    slackIntegration: false,
    slackWebhook: '',
  });

  const handleSave = (section: string) => {
    toast({ title: 'Settings Saved', description: `${section} settings have been updated.` });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Platform Settings"
          description="Configure global platform settings and preferences"
        />

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Platform Name</Label>
                    <Input
                      value={generalSettings.platformName}
                      onChange={e => setGeneralSettings(s => ({ ...s, platformName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={e => setGeneralSettings(s => ({ ...s, supportEmail: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Timezone</Label>
                    <Select value={generalSettings.defaultTimezone} onValueChange={v => setGeneralSettings(s => ({ ...s, defaultTimezone: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Language</Label>
                    <Select value={generalSettings.defaultLanguage} onValueChange={v => setGeneralSettings(s => ({ ...s, defaultLanguage: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Disable access for all users except super admins</p>
                  </div>
                  <Switch
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={v => setGeneralSettings(s => ({ ...s, maintenanceMode: v }))}
                  />
                </div>

                <Button onClick={() => handleSave('General')}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Configuration
                </CardTitle>
                <CardDescription>SMTP settings for transactional emails</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input
                      value={emailSettings.smtpHost}
                      onChange={e => setEmailSettings(s => ({ ...s, smtpHost: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Input
                      value={emailSettings.smtpPort}
                      onChange={e => setEmailSettings(s => ({ ...s, smtpPort: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Username</Label>
                    <Input
                      value={emailSettings.smtpUser}
                      onChange={e => setEmailSettings(s => ({ ...s, smtpUser: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label>From Name</Label>
                    <Input
                      value={emailSettings.fromName}
                      onChange={e => setEmailSettings(s => ({ ...s, fromName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>From Email</Label>
                    <Input
                      value={emailSettings.fromEmail}
                      onChange={e => setEmailSettings(s => ({ ...s, fromEmail: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => handleSave('Email')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline">Send Test Email</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Authentication and security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Enforce MFA for all admin users</p>
                  </div>
                  <Switch
                    checked={securitySettings.requireMfa}
                    onCheckedChange={v => setSecuritySettings(s => ({ ...s, requireMfa: v }))}
                  />
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={e => setSecuritySettings(s => ({ ...s, sessionTimeout: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Login Attempts</Label>
                    <Input
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={e => setSecuritySettings(s => ({ ...s, maxLoginAttempts: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Password Length</Label>
                    <Input
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={e => setSecuritySettings(s => ({ ...s, passwordMinLength: e.target.value }))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Password Requirements</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Require special character</span>
                    <Switch
                      checked={securitySettings.requireSpecialChar}
                      onCheckedChange={v => setSecuritySettings(s => ({ ...s, requireSpecialChar: v }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Require uppercase letter</span>
                    <Switch
                      checked={securitySettings.requireUppercase}
                      onCheckedChange={v => setSecuritySettings(s => ({ ...s, requireUppercase: v }))}
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave('Security')}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure admin notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Email Notifications</Label>
                  {[
                    { key: 'emailNewSchool', label: 'New school registration' },
                    { key: 'emailPaymentReceived', label: 'Payment received' },
                    { key: 'emailTicketCreated', label: 'Support ticket created' },
                    { key: 'emailSubscriptionExpiring', label: 'Subscription expiring' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between">
                      <span className="text-sm">{item.label}</span>
                      <Switch
                        checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                        onCheckedChange={v => setNotificationSettings(s => ({ ...s, [item.key]: v }))}
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Slack Integration</Label>
                      <p className="text-sm text-muted-foreground">Send notifications to Slack</p>
                    </div>
                    <Switch
                      checked={notificationSettings.slackIntegration}
                      onCheckedChange={v => setNotificationSettings(s => ({ ...s, slackIntegration: v }))}
                    />
                  </div>
                  {notificationSettings.slackIntegration && (
                    <div className="space-y-2">
                      <Label>Slack Webhook URL</Label>
                      <Input
                        placeholder="https://hooks.slack.com/services/..."
                        value={notificationSettings.slackWebhook}
                        onChange={e => setNotificationSettings(s => ({ ...s, slackWebhook: e.target.value }))}
                      />
                    </div>
                  )}
                </div>

                <Button onClick={() => handleSave('Notifications')}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup & Recovery
                </CardTitle>
                <CardDescription>Database backup configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Last Backup</h4>
                      <p className="text-sm text-muted-foreground">2024-01-20 03:00 AM UTC</p>
                    </div>
                    <Badge>Successful</Badge>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Retention Period</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => handleSave('Backup')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline">Create Manual Backup</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
