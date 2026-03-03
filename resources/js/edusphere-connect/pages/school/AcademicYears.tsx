import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormDialog } from '@/components/shared/FormDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Calendar, Plus, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Term {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  terms: Term[];
}

const MOCK_YEARS: AcademicYear[] = [
  {
    id: '1',
    name: '2024-2025',
    startDate: '2024-09-01',
    endDate: '2025-06-30',
    isCurrent: true,
    terms: [
      { id: '1a', name: 'Fall Term', startDate: '2024-09-01', endDate: '2024-12-20' },
      { id: '1b', name: 'Spring Term', startDate: '2025-01-06', endDate: '2025-04-15' },
      { id: '1c', name: 'Summer Term', startDate: '2025-04-21', endDate: '2025-06-30' },
    ],
  },
  {
    id: '2',
    name: '2023-2024',
    startDate: '2023-09-01',
    endDate: '2024-06-30',
    isCurrent: false,
    terms: [
      { id: '2a', name: 'Fall Term', startDate: '2023-09-01', endDate: '2023-12-20' },
      { id: '2b', name: 'Spring Term', startDate: '2024-01-08', endDate: '2024-04-12' },
      { id: '2c', name: 'Summer Term', startDate: '2024-04-22', endDate: '2024-06-30' },
    ],
  },
];

export default function AcademicYears() {
  const { toast } = useToast();
  const [years, setYears] = useState(MOCK_YEARS);
  const [yearFormOpen, setYearFormOpen] = useState(false);
  const [termFormOpen, setTermFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);
  const [deletingYear, setDeletingYear] = useState<AcademicYear | null>(null);

  const [yearFormData, setYearFormData] = useState({ name: '', startDate: '', endDate: '' });
  const [termFormData, setTermFormData] = useState({ name: '', startDate: '', endDate: '' });

  const handleCreateYear = () => {
    setEditingYear(null);
    setYearFormData({ name: '', startDate: '', endDate: '' });
    setYearFormOpen(true);
  };

  const handleEditYear = (year: AcademicYear) => {
    setEditingYear(year);
    setYearFormData({ name: year.name, startDate: year.startDate, endDate: year.endDate });
    setYearFormOpen(true);
  };

  const handleSubmitYear = () => {
    if (editingYear) {
      setYears(prev => prev.map(y => y.id === editingYear.id ? { ...y, ...yearFormData } : y));
      toast({ title: 'Academic Year Updated' });
    } else {
      const newYear: AcademicYear = {
        id: String(years.length + 1),
        ...yearFormData,
        isCurrent: false,
        terms: [],
      };
      setYears(prev => [...prev, newYear]);
      toast({ title: 'Academic Year Created' });
    }
    setYearFormOpen(false);
  };

  const handleAddTerm = (year: AcademicYear) => {
    setSelectedYear(year);
    setTermFormData({ name: '', startDate: '', endDate: '' });
    setTermFormOpen(true);
  };

  const handleSubmitTerm = () => {
    if (!selectedYear) return;
    const newTerm: Term = {
      id: `${selectedYear.id}${Date.now()}`,
      ...termFormData,
    };
    setYears(prev => prev.map(y =>
      y.id === selectedYear.id
        ? { ...y, terms: [...y.terms, newTerm] }
        : y
    ));
    toast({ title: 'Term Added' });
    setTermFormOpen(false);
  };

  const handleSetCurrent = (year: AcademicYear) => {
    setYears(prev => prev.map(y => ({ ...y, isCurrent: y.id === year.id })));
    toast({ title: 'Current Year Updated', description: `${year.name} is now the current academic year.` });
  };

  const handleDeleteYear = () => {
    if (deletingYear) {
      setYears(prev => prev.filter(y => y.id !== deletingYear.id));
      toast({ title: 'Academic Year Deleted', variant: 'destructive' });
    }
    setDeleteOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Academic Years" description="Manage academic years and terms" primaryAction={{ label: 'Add Academic Year', onClick: handleCreateYear }} />

        <div className="grid gap-6 lg:grid-cols-2">
          {years.map(year => (
            <Card key={year.id} className={year.isCurrent ? 'ring-2 ring-primary' : ''}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>{year.name}</CardTitle>
                    {year.isCurrent && <Badge>Current</Badge>}
                  </div>
                  <CardDescription>
                    {new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover">
                    <DropdownMenuItem onClick={() => handleEditYear(year)}>
                      <Pencil className="mr-2 h-4 w-4" />Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddTerm(year)}>
                      <Plus className="mr-2 h-4 w-4" />Add Term
                    </DropdownMenuItem>
                    {!year.isCurrent && (
                      <DropdownMenuItem onClick={() => handleSetCurrent(year)}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />Set as Current
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => { setDeletingYear(year); setDeleteOpen(true); }} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Terms</h4>
                  {year.terms.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No terms defined</p>
                  ) : (
                    year.terms.map(term => (
                      <div key={term.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-sm">{term.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(term.startDate).toLocaleDateString()} - {new Date(term.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Academic Year Form */}
        <FormDialog open={yearFormOpen} onOpenChange={setYearFormOpen} title={editingYear ? 'Edit Academic Year' : 'Add Academic Year'} onSubmit={handleSubmitYear}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Year Name</Label>
              <Input value={yearFormData.name} onChange={e => setYearFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g., 2024-2025" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={yearFormData.startDate} onChange={e => setYearFormData(p => ({ ...p, startDate: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={yearFormData.endDate} onChange={e => setYearFormData(p => ({ ...p, endDate: e.target.value }))} />
              </div>
            </div>
          </div>
        </FormDialog>

        {/* Term Form */}
        <FormDialog open={termFormOpen} onOpenChange={setTermFormOpen} title={`Add Term to ${selectedYear?.name}`} onSubmit={handleSubmitTerm}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Term Name</Label>
              <Input value={termFormData.name} onChange={e => setTermFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Fall Term" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={termFormData.startDate} onChange={e => setTermFormData(p => ({ ...p, startDate: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={termFormData.endDate} onChange={e => setTermFormData(p => ({ ...p, endDate: e.target.value }))} />
              </div>
            </div>
          </div>
        </FormDialog>

        <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Academic Year" description={`Delete ${deletingYear?.name}? This will also remove all associated terms.`} confirmLabel="Delete" onConfirm={handleDeleteYear} variant="destructive" />
      </div>
    </DashboardLayout>
  );
}
