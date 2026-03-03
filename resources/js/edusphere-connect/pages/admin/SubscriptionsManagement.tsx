import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatsCard } from '@/components/shared/StatsCard';
import { FormDialog } from '@/components/shared/FormDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, DollarSign, TrendingUp, Users, CreditCard, Download, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  id: string;
  schoolName: string;
  plan: string;
  status: 'active' | 'cancelled' | 'pending' | 'trial';
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  nextBilling: string;
  startDate: string;
}

interface Invoice {
  id: string;
  schoolName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
}

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { id: '1', schoolName: 'Lincoln High School', plan: 'Premium', status: 'active', amount: 999, billingCycle: 'monthly', nextBilling: '2024-02-15', startDate: '2024-01-15' },
  { id: '2', schoolName: 'Oak Valley Academy', plan: 'Trial', status: 'trial', amount: 0, billingCycle: 'monthly', nextBilling: '2024-02-28', startDate: '2024-02-01' },
  { id: '3', schoolName: 'Riverside Elementary', plan: 'Standard', status: 'active', amount: 499, billingCycle: 'yearly', nextBilling: '2025-09-01', startDate: '2023-09-01' },
  { id: '4', schoolName: 'Summit Prep School', plan: 'Premium', status: 'cancelled', amount: 999, billingCycle: 'monthly', nextBilling: '-', startDate: '2023-06-15' },
  { id: '5', schoolName: 'Westfield Middle School', plan: 'Standard', status: 'active', amount: 499, billingCycle: 'monthly', nextBilling: '2024-02-20', startDate: '2023-08-20' },
];

const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-001', schoolName: 'Lincoln High School', amount: 999, status: 'paid', dueDate: '2024-01-15', paidDate: '2024-01-14' },
  { id: 'INV-002', schoolName: 'Riverside Elementary', amount: 5988, status: 'paid', dueDate: '2023-09-01', paidDate: '2023-08-30' },
  { id: 'INV-003', schoolName: 'Westfield Middle School', amount: 499, status: 'pending', dueDate: '2024-02-20' },
  { id: 'INV-004', schoolName: 'Summit Prep School', amount: 999, status: 'overdue', dueDate: '2024-01-01' },
  { id: 'INV-005', schoolName: 'Greenwood Academy', amount: 999, status: 'paid', dueDate: '2024-01-10', paidDate: '2024-01-09' },
];

const PLANS = [
  { id: 'trial', name: 'Trial', price: 0, duration: '14 days', features: ['Up to 100 students', 'Basic modules', 'Email support'] },
  { id: 'standard', name: 'Standard', price: 499, duration: '/month', features: ['Up to 500 students', 'All core modules', 'Priority support', 'Reports'] },
  { id: 'premium', name: 'Premium', price: 999, duration: '/month', features: ['Up to 2000 students', 'All modules', '24/7 support', 'Custom reports', 'API access'] },
  { id: 'enterprise', name: 'Enterprise', price: 2499, duration: '/month', features: ['Unlimited students', 'All features', 'Dedicated support', 'Custom development', 'SLA'] },
];

export default function SubscriptionsManagement() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [editPlanOpen, setEditPlanOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [planFormData, setPlanFormData] = useState({ name: '', price: '', features: '' });

  const subscriptionColumns = [
    { key: 'schoolName', label: 'School' },
    { key: 'plan', label: 'Plan' },
    {
      key: 'status',
      label: 'Status',
      render: (sub: Subscription) => <StatusBadge status={sub.status} />,
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (sub: Subscription) => `$${sub.amount}/${sub.billingCycle === 'yearly' ? 'yr' : 'mo'}`,
    },
    { key: 'nextBilling', label: 'Next Billing' },
    {
      key: 'actions',
      label: '',
      render: (sub: Subscription) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Change Plan</DropdownMenuItem>
            <DropdownMenuItem>Cancel Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const invoiceColumns = [
    { key: 'id', label: 'Invoice ID' },
    { key: 'schoolName', label: 'School' },
    {
      key: 'amount',
      label: 'Amount',
      render: (inv: Invoice) => `$${inv.amount.toLocaleString()}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (inv: Invoice) => (
        <StatusBadge status={inv.status === 'paid' ? 'completed' : inv.status === 'overdue' ? 'suspended' : 'pending'} />
      ),
    },
    { key: 'dueDate', label: 'Due Date' },
    {
      key: 'actions',
      label: '',
      render: (inv: Invoice) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" title="Download">
            <Download className="h-4 w-4" />
          </Button>
          {inv.status !== 'paid' && (
            <Button variant="ghost" size="icon" title="Send Reminder">
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleEditPlan = (plan: typeof PLANS[0]) => {
    setSelectedPlan(plan);
    setPlanFormData({
      name: plan.name,
      price: String(plan.price),
      features: plan.features.join('\n'),
    });
    setEditPlanOpen(true);
  };

  const handleSavePlan = () => {
    toast({ title: 'Plan Updated', description: `${planFormData.name} plan has been updated.` });
    setEditPlanOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Subscriptions & Billing"
          description="Manage subscription plans, billing, and invoices"
        />

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard title="Monthly Revenue" value="$128,400" icon={DollarSign} trend={{ value: '+23%', direction: 'up' }} description="vs last month" />
          <StatsCard title="Active Subscriptions" value="142" icon={Users} trend={{ value: '+8', direction: 'up' }} description="this month" />
          <StatsCard title="Pending Invoices" value="$12,450" icon={CreditCard} trend={{ value: '12', direction: 'down' }} description="invoices" />
          <StatsCard title="Growth Rate" value="18.2%" icon={TrendingUp} trend={{ value: '+2.1%', direction: 'up' }} description="vs last month" />
        </div>

        <Tabs defaultValue="subscriptions">
          <TabsList>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="mt-6">
            <DataTable
              columns={subscriptionColumns}
              data={MOCK_SUBSCRIPTIONS}
              searchPlaceholder="Search subscriptions..."
              searchValue={search}
              onSearchChange={setSearch}
            />
          </TabsContent>

          <TabsContent value="invoices" className="mt-6">
            <DataTable
              columns={invoiceColumns}
              data={MOCK_INVOICES}
              searchPlaceholder="Search invoices..."
            />
          </TabsContent>

          <TabsContent value="plans" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {PLANS.map((plan) => (
                <Card key={plan.id} className="relative">
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-2xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-muted-foreground">{plan.duration}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={() => handleEditPlan(plan)}
                    >
                      Edit Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <FormDialog
          open={editPlanOpen}
          onOpenChange={setEditPlanOpen}
          title="Edit Plan"
          description="Update the subscription plan details."
          onSubmit={handleSavePlan}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input
                value={planFormData.name}
                onChange={e => setPlanFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Price ($/month)</Label>
              <Input
                type="number"
                value={planFormData.price}
                onChange={e => setPlanFormData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Features (one per line)</Label>
              <textarea
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={planFormData.features}
                onChange={e => setPlanFormData(prev => ({ ...prev, features: e.target.value }))}
              />
            </div>
          </div>
        </FormDialog>
      </div>
    </DashboardLayout>
  );
}
