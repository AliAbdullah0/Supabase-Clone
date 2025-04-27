"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Toaster, toast } from 'sonner';
import { createUser, loginUser } from '@/actions/user.actions';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

interface AuthResponse {
  success: boolean;
  status: number;
  message:string;
}

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;
type SignInFormData = z.infer<typeof signInSchema>;

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpFormData | SignInFormData>({
    resolver: zodResolver(mode === 'signup' ? signUpSchema : signInSchema),
    defaultValues:
      mode === 'signup'
        ? {
            username: '',
            email: '',
            password: '',
          }
        : {
            email: '',
            password: '',
          },
  });

  const onSubmit = async (data: SignUpFormData | SignInFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set('email', data.email);
      formData.set('password', data.password);
      if (mode === 'signup' && 'username' in data) {
        formData.set('username', data.username);
      }

      const response: AuthResponse | undefined =
        mode === 'signup' ? await createUser(formData) : await loginUser(formData);

        if (response) {
          if (!response.success) {
            const errorMessage =
              response.status === 403
                ? 'Invalid credentials'
                : response.status === 500
                ? 'Server error, please try again'
                : 'User already exists';
            setError(errorMessage);
            toast.error(errorMessage);
          } else if (response.success) {
            toast.success(response.message);
            router.push('/dashboard');
          }
        }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark px-4">
      <Card className={cn('bg-dark text-neutral-100 border-white/10 w-full min-w-[500px]')}>
        <CardHeader className="flex justify-between items-center gap-2 pb-6">
          <Image
            src="/supabase-logo-icon.png"
            alt="Supabase Logo"
            width={43}
            height={43}
            className="mb-2"
          />
          <CardTitle className="text-3xl font-bold">
            {mode === 'signup' ? 'Sign Up' : 'Sign In'}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {mode === 'signup' && (
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your username"
                          className={cn(
                            'bg-hover border-white/10 text-neutral-100 placeholder:text-neutral-400 h-12 text-lg',
                            'focus:ring-main focus:border-main'
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className={cn(
                          'bg-hover border-white/10 text-neutral-100 placeholder:text-neutral-400 h-12 text-lg',
                          'focus:ring-main focus:border-main'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className={cn(
                          'bg-hover border-white/10 text-neutral-100 placeholder:text-neutral-400 h-12 text-lg',
                          'focus:ring-main focus:border-main'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className={cn(
                  'w-full bg-main hover:bg-hover text-white hover:border hover:border-green-600 transition-transform duration-200 h-12 text-lg',
                  isLoading && 'opacity-70 cursor-not-allowed'
                )}
                disabled={isLoading}
              >
                {isLoading ? <p className='flex items-center justify-center w-full'><Loader2 className='h-4 w-4 mr-2 animate-spin'/>{mode==='signup' ? 'Signing Up' : 'Signing In'}</p> : mode === 'signup' ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>
          </Form>
          <p className="text-center text-base mt-6">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <Link href="/sign-in" className="text-[#25a36f] hover:underline ml-1">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don’t have an account?{' '}
                <Link href="/sign-up" className="text-[#25a36f] hover:underline ml-1">
                  Sign up
                </Link>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;