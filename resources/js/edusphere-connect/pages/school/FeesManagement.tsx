import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatsCard } from '@/components/shared/StatsCard';
import { FormDialog } from '@/components/shared/FormDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, DollarSign, CreditCard, TrendingUp, AlertCircle, Send, Download, Eye, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeeStructure {
  id: string;
  name: string;
  class: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
  dueDate: string;
}

interface Invoice {
  id: string;
  invoiceNo: string;
  studentName: string;
  class: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
}

interface Payment {
  id: string;
  receiptNo: string;
  studentName: string;
  amount: number;
  method: string;
  date: string;
  invoiceNo: string;
}

const MOCK_FEE_STRUCTURES: FeeStructure[] = [
  { id: '1', name: 'Tuition Fee', class: 'Grade 9', amount: 5000, frequency: 'quarterly', dueDate: '15th of first month' },
  { id: '2', name: 'Tuition Fee', class: 'Grade 10', amount: 5500, frequency: 'quarterly', dueDate: '15th of first month' },
  { id: '3', name: 'Lab Fee', class: 'Grade 11', amount: 1000, frequency: 'yearly', dueDate: 'September 30' },
  { id: '4', name: 'Library Fee', class: 'All', amount: 200, frequency: 'yearly', dueDate: 'September 15' },
  { id: '5', name: 'Sports Fee', class: 'All', amount: 300, frequency: 'yearly', dueDate: 'September 15' },
];

const MOCK_INVOICES: Invoice[] = [
  { id: '1', invoiceNo: 'INV-2024-001', studentName: 'John Doe', class: 'Grade 10', amount: 5700, paidAmount: 5700, dueDate: '2024-01-15', status: 'paid' },
  { id: '2', invoiceNo: 'INV-2024-002', studentName: 'Jane Smith', class: 'Grade 10', amount: 5700, paidAmount: 3000, dueDate: '2024-01-15', status: 'partial' },
  { id: '3', invoiceNo: 'INV-2024-003', studentName: 'Mike Johnson', class: 'Grade 9', amount: 5200, paidAmount: 0, dueDate: '2024-01-15', status: 'overdue' },
  { id: '4', invoiceNo: 'INV-2024-004', studentName: 'Emily Brown', class: 'Grade 11', amount: 6500, paidAmount: 0, dueDate: '2024-02-15', status: 'pending' },
  { id: '5', invoiceNo: 'INV-2024-005', studentName: 'Chris Wilson', class: 'Grade 10', amount: 5700, paidAmount: 5700, dueDate: '2024-01-15', status: 'paid' },
];

const MOCK_PAYMENTS: Payment[] = [
  { id: '1', receiptNo: 'RCP-2024-001', studentName: 'John Doe', amount: 5700, method: 'Bank Transfer', date: '2024-01-10', invoiceNo: 'INV-2024-001' },
  { id: '2', receiptNo: 'RCP-2024-002', studentName: 'Jane Smith', amount: 3000, method: 'Cash', date: '2024-01-12', invoiceNo: 'INV-2024-002' },
  { id: '3', receiptNo: 'RCP-2024-003', studentName: 'Chris Wilson', amount: 5700, method: 'Credit Card', date: '2024-01-14', invoiceNo: 'INV-2024-005' },
];

export default function FeesManagement() {
  const { toast } = useToast();
  const [feeFormOpen, setFeeFormOpen] = useState(false);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [search, setSearch] = useState('');

  const [feeFormData, setFeeFormData] = useState({
    name: '', class: '', amount: '', frequency: 'quarterly', dueDate: '',
  });

  const [paymentFormData, setPaymentFormData] = useState({
    studentName: '', invoiceNo: '', amount: '', method: 'cash',
  });

  const totalCollected = MOCK_PAYMENTS.reduce((acc, p) => acc + p.amount, 0);
  const totalPending = MOCK_INVOICES.filter(i => i.status !== 'paid').reduce((acc, i) => acc + (i.amount - i.paidAmount), 0);
  const overdueCount = MOCK_INVOICES.filter(i => i.status === 'overdue').length;

  const handleAddFee = () => {
    toast({ title: 'Fee Structure Added' });
    setFeeFormOpen(false);
  };

  const handleRecordPayment = () => {
    toast({ title: 'Payment Recorded', description: `Receipt generated: RCP-2024-${String(MOCK_PAYMENTS.length + 1).padStart(3, '0')}` });
    setPaymentFormOpen(false);
  };

  const invoiceColumns = [
    { key: 'invoiceNo', label: 'Invoice #' },
    { key: 'studentName', label: 'Student' },
    { key: 'class', label: 'Class' },
    { key: 'amount', label: 'Amount', render: (i: Invoice) => `$${i.amount.toLocaleString()}` },
    { key: 'paidAmount', label: 'Paid', render: (i: Invoice) => `$${i.paidAmount.toLocaleString()}` },
    { key: 'dueDate', label: 'Due Date' },
    {
      key: 'status',
      label: 'Status',
      render: (i: Invoice) => <StatusBadge status={i.status === 'paid' ? 'completed' : i.status === 'overdue' ? 'suspended' : i.status === 'partial' ? 'trial' : 'pending'} />,
    },
    {
      key: 'actions',
      label: '',
      render: (invoice: Invoice) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
            <DropdownMenuItem><Download className="mr-2 h-4 w-4" />Download</DropdownMenuItem>
            <DropdownMenuItem><Send className="mr-2 h-4 w-4" />Send Reminder</DropdownMenuItem>
            {invoice.status !== 'paid' && (
              <DropdownMenuItem onClick={() => setPaymentFormOpen(true)}>
                <CreditCard className="mr-2 h-4 w-4" />Record Payment
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const paymentColumns = [
    { key: 'receiptNo', label: 'Receipt #' },
    { key: 'studentName', label: 'Student' },
    { key: 'invoiceNo', label: 'Invoice #' },
    { key: 'amount', label: 'Amount', render: (p: Payment) => `$${p.amount.toLocaleString()}` },
    { key: 'method', label: 'Method' },
    { key: 'date', label: 'Date' },
    {
      key: 'actions',
      label: '',
      render: () => (
        <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
      ),
    },
  ];

  const feeColumns = [
    { key: 'name', label: 'Fee Type' },
    { key: 'class', label: 'Class' },
    { key: 'amount', label: 'Amount', render: (f: FeeStructure) => `$${f.amount.toLocaleString()}` },
    { key: 'frequency', label: 'Frequency', render: (f: FeeStructure) => <Badge variant="outline" className="capitalize">{f.frequency}</Badge> },
    { key: 'dueDate', label: 'Due Date' },
    {
      key: 'actions',
      label: '',
      render: () => (
        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Fees & Invoices" 
          description="Manage fee structures, invoices, and payments"
          primaryAction={{ label: 'Record Payment', onClick: () => setPaymentFormOpen(true) }}
        />

        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard title="Total Collected" value={`$${totalCollected.toLocaleString()}`} icon={DollarSign} trend={{ value: '+12%', direction: 'up' }} />
          <StatsCard title="Pending" value={`$${totalPending.toLocaleString()}`} icon={CreditCard} />
          <StatsCard title="Overdue Invoices" value={overdueCount} icon={AlertCircle} iconColor="text-destructive" />
          <StatsCard title="Collection Rate" value="87%" icon={TrendingUp} />
        </div>

        <Tabs defaultValue="invoices">
          <TabsList>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="structure">Fee Structure</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="mt-6">
            <DataTable columns={invoiceColumns} data={MOCK_INVOICES.filter(i => i.studentName.toLowerCase().includes(search.toLowerCase()))} searchPlaceholder="Search invoices..." searchValue={search} onSearchChange={setSearch} />
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <DataTable columns={paymentColumns} data={MOCK_PAYMENTS} searchPlaceholder="Search payments..." />
          </TabsContent>

          <TabsContent value="structure" className="mt-6">
            <div className="mb-4">
              <Button onClick={() => setFeeFormOpen(true)}>Add Fee Type</Button>
            </div>
            <DataTable columns={feeColumns} data={MOCK_FEE_STRUCTURES} />
          </TabsContent>
        </Tabs>

        {/* Fee Structure Form */}
        <FormDialog open={feeFormOpen} onOpenChange={setFeeFormOpen} title="Add Fee Structure" onSubmit={handleAddFee}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Fee Name</Label>
              <Input value={feeFormData.name} onChange={e => setFeeFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Tuition Fee" />
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={feeFormData.class} onValueChange={v => setFeeFormData(p => ({ ...p, class: v }))}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Classes</SelectItem>
                  <SelectItem value="Grade 9">Grade 9</SelectItem>
                  <SelectItem value="Grade 10">Grade 10</SelectItem>
                  <SelectItem value="Grade 11">Grade 11</SelectItem>
                  <SelectItem value="Grade 12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" value={feeFormData.amount} onChange={e => setFeeFormData(p => ({ ...p, amount: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={feeFormData.frequency} onValueChange={v => setFeeFormData(p => ({ ...p, frequency: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FormDialog>

        {/* Payment Form */}
        <FormDialog open={paymentFormOpen} onOpenChange={setPaymentFormOpen} title="Record Payment" onSubmit={handleRecordPayment}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Invoice Number</Label>
              <Select value={paymentFormData.invoiceNo} onValueChange={v => setPaymentFormData(p => ({ ...p, invoiceNo: v }))}>
                <SelectTrigger><SelectValue placeholder="Select invoice" /></SelectTrigger>
                <SelectContent>
                  {MOCK_INVOICES.filter(i => i.status !== 'paid').map(i => (
                    <SelectItem key={i.id} value={i.invoiceNo}>{i.invoiceNo} - {i.studentName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" value={paymentFormData.amount} onChange={e => setPaymentFormData(p => ({ ...p, amount: e.target.value }))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Payment Method</Label>
              <Select value={paymentFormData.method} onValueChange={v => setPaymentFormData(p => ({ ...p, method: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FormDialog>
      </div>
    </DashboardLayout>
  );
}
