'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createDatabase, getAllDatabases } from '@/actions/database.actions';
import { getProject } from '@/actions/project.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Badge from '@/components/ui/Badge';
import { Database, Plus, Save } from 'lucide-react';
import Link from 'next/link';

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, 'Database name is required').max(100, 'Database name must be 100 characters or less'),
});

type Database = {
  id: string;
  name: string | null;
  created_at: Date;
};

const DatabasePage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const router = useRouter();
  const [databases, setDatabases] = useState<Database[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [paramSlug,setParamSlug ] = useState('')
  // Initialize shadcn/ui form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    const fetchDatabases = async () => {
        try {
          const { slug } = await params;
        const project = await getProject(slug);
        if (!project) {
          throw new Error('Project not found');
        }
        const dbList = await getAllDatabases(project.id);
        setDatabases(dbList);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch databases');
      }
    };
    fetchDatabases();
  }, [params]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    try {
      const { slug } = await params;
      setParamSlug(slug)
      const project = await getProject(slug);
      if (!project) {
        throw new Error('Project not found');
      }

      const formData = new FormData();
      formData.append('name', values.name);

      await createDatabase(project.id, formData);
      setIsOpen(false);
      form.reset();
      const dbList = await getAllDatabases(project.id);
      setDatabases(dbList);
    } catch (err: any) {
      setError(err.message || 'Failed to create database. Please try again.');
    }
  };

  return (
    <div className="flex w-full flex-col px-7 py-8 bg-dark min-h-screen">
      <div className="flex items-center gap-3">
        <h2 className="text-4xl font-bold text-white">Project Databases</h2>
        <Badge text="Database Manager" className="mt-1.5 bg-main text-white" />
      </div>
      <p className="text-white/75 mt-2 max-w-2xl">
        Manage your project’s databases. Create a new database or view existing ones.
      </p>

      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <div className="bg-hover border border-white/10 rounded-lg p-6 hover:bg-[#1a1a1a] transition-colors cursor-pointer flex flex-col items-center justify-center h-48">
                <Plus className="h-12 w-12 text-green mb-4" />
                <h3 className="text-xl font-semibold text-white">Create New Database</h3>
              </div>
            </DialogTrigger>
            <DialogContent className="bg-dark border border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">Create New Database</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Database Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              className="pl-10 w-full bg-[#171717] border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-main"
                              placeholder="Enter database name"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  {error && (
                    <p className="text-red-500">{error}</p>
                  )}
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="bg-main text-white px-6 py-3 rounded-md hover:bg-[#007a4a] transition-colors disabled:opacity-50 flex items-center gap-2 w-full"
                  >
                    {form.formState.isSubmitting ? 'Creating...' : (
                      <>
                        <Save className="h-5 w-5" />
                        Create Database
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          {databases.map((db) => (
            <Link
            href={`/dashboard/project/${paramSlug}/database/${db.id}/table/`}
            key={db.id}
            className="bg-hover border border-white/10 rounded-lg p-6 hover:bg-[#1a1a1a] transition-colors flex flex-col min-h-[150px]"
          >
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-green" />
              <h3 className="text-2xl font-bold text-white">{db.name || 'Unnamed Database'}</h3>
            </div>
            <div className="mt-auto flex justify-between items-end text-xs sm:text-sm text-white/75">
              <p>
                <span className="font-semibold">ID:</span> {db.id.slice(0, 8)}...
              </p>
              <p>
                <span className="font-semibold">Created:</span> {new Date(db.created_at).toLocaleDateString()}
              </p>
            </div>
          </Link>
          ))}
        </div>

        {databases.length === 0 && (
          <p className="text-white/75 mt-6">No databases found. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default DatabasePage;