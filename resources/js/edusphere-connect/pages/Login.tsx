import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      
      // Navigate based on role (determined by email for demo)
      if (email.includes('admin@eduplatform')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const quickLogin = (role: string) => {
    const emails: Record<string, string> = {
      super_admin: 'admin@eduplatform.com',
      school_admin: 'principal@springfield.edu',
      teacher: 'teacher@springfield.edu',
      student: 'student@springfield.edu',
      parent: 'parent@email.com',
      staff: 'staff@springfield.edu',
    };
    setEmail(emails[role] || '');
    setPassword('demo123');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Link to="/" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </Link>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>

            {/* Quick login for demo */}
            <div className="mt-6 border-t pt-6">
              <p className="mb-3 text-center text-sm text-muted-foreground">
                Quick login (Demo)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('super_admin')}
                >
                  Super Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('school_admin')}
                >
                  School Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('teacher')}
                >
                  Teacher
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('student')}
                >
                  Student
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('parent')}
                >
                  Parent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('staff')}
                >
                  Staff
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Branding */}
      <div className="hidden flex-1 items-center justify-center gradient-hero lg:flex">
        <div className="max-w-md text-center text-white">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            <GraduationCap className="h-9 w-9 text-secondary-foreground" />
          </div>
          <h2 className="mb-4 text-3xl font-bold">EduPlatform</h2>
          <p className="text-white/80">
            The complete school management solution for modern educational institutions.
            Manage academics, administration, and operations - all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
