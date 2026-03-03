import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Status = 'active' | 'inactive' | 'pending' | 'suspended' | 'trial' | 'completed' | 'cancelled' | 'draft' | 'published' | 'archived';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  pending: { label: 'Pending', variant: 'outline' },
  suspended: { label: 'Suspended', variant: 'destructive' },
  trial: { label: 'Trial', variant: 'secondary' },
  completed: { label: 'Completed', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  draft: { label: 'Draft', variant: 'outline' },
  published: { label: 'Published', variant: 'default' },
  archived: { label: 'Archived', variant: 'secondary' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'outline' as const };
  
  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}
