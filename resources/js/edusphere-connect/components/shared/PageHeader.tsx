import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  description?: string;
  backLink?: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ReactNode;
  };
  secondaryActions?: {
    label: string;
    onClick?: () => void;
    variant?: 'outline' | 'secondary' | 'ghost';
  }[];
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  backLink,
  primaryAction,
  secondaryActions,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          {backLink && (
            <Link to={backLink}>
              <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl truncate">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground sm:text-base line-clamp-2">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {secondaryActions?.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              onClick={action.onClick}
              size="sm"
              className="sm:h-10 sm:px-4"
            >
              {action.label}
            </Button>
          ))}
          {primaryAction && (
            primaryAction.href ? (
              <Link to={primaryAction.href}>
                <Button size="sm" className="sm:h-10 sm:px-4">
                  {primaryAction.icon || <Plus className="mr-1.5 h-4 w-4 sm:mr-2" />}
                  <span className="hidden xs:inline sm:inline">{primaryAction.label}</span>
                  <span className="xs:hidden">Add</span>
                </Button>
              </Link>
            ) : (
              <Button onClick={primaryAction.onClick} size="sm" className="sm:h-10 sm:px-4">
                {primaryAction.icon || <Plus className="mr-1.5 h-4 w-4 sm:mr-2" />}
                <span>{primaryAction.label}</span>
              </Button>
            )
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
