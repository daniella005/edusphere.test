import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  GraduationCap,
  Building2,
  Users,
  BarChart3,
  Shield,
  Clock,
  Globe,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Building2,
    title: 'Multi-Tenant Architecture',
    description: 'Manage unlimited schools with complete data isolation and customizable configurations.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Fine-grained permissions for admins, teachers, students, parents, and staff.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time dashboards, performance tracking, and comprehensive reporting.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant with encrypted data, audit logs, and secure authentication.',
  },
  {
    icon: Clock,
    title: 'Automated Workflows',
    description: 'Streamline attendance, grading, fee collection, and communications.',
  },
  {
    icon: Globe,
    title: 'Cloud-Native',
    description: 'Accessible anywhere with 99.9% uptime and automatic backups.',
  },
];

const MODULES = [
  'Academic Management',
  'Student Information System',
  'Attendance Tracking',
  'Exam & Grading',
  'Fee Management',
  'HR & Payroll',
  'Transport Management',
  'Library System',
  'Learning Management',
  'Communication Hub',
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EduPlatform</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero absolute inset-0 opacity-95" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              Enterprise School Management
              <span className="block text-secondary">Made Simple</span>
            </h1>
            <p className="mb-8 text-lg text-white/80 md:text-xl">
              A comprehensive, cloud-based platform to manage academics, administration, 
              and operations for schools of any size. Built for scale, designed for simplicity.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 sm:w-auto">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Enterprise-Grade Features</h2>
            <p className="text-muted-foreground">
              Everything you need to run a modern educational institution, 
              from a single school to a nationwide network.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="shadow-card transition-shadow hover:shadow-elegant">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                      <Icon className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="bg-muted/50 py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Comprehensive Modules</h2>
            <p className="text-muted-foreground">
              Enable only the features you need. Each module is independently configurable per school.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
            {MODULES.map((module) => (
              <div
                key={module}
                className="flex items-center gap-3 rounded-lg bg-card p-4 shadow-sm"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-secondary" />
                <span className="font-medium">{module}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <Card className="gradient-primary text-white">
            <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
              <h2 className="text-3xl font-bold">Ready to Transform Your School?</h2>
              <p className="max-w-xl text-white/80">
                Join thousands of schools worldwide using EduPlatform to streamline 
                operations and improve educational outcomes.
              </p>
              <Link to="/login">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">EduPlatform</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 EduPlatform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
