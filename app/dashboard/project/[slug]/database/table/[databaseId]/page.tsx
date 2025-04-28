'use client';

import React, { useState, useEffect } from 'react';
import { getTables, createTable } from '@/actions/database.actions';
import { DatabasePageProps } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, Plus, Save } from 'lucide-react';

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, 'Table name is required').max(100, 'Table name must be 100 characters or less'),
  columns: z
    .array(
      z.object({
        name: z.string().min(1, 'Column name is required'),
        type: z.enum(['TEXT', 'INTEGER', 'BOOLEAN', 'DATE', 'FLOAT']),
        isNullable: z.boolean().default(true),
        isPrimary: z.boolean().default(false),
        isForeignKey: z.boolean().default(false),
        foreignTableId: z.string().optional(),
        foreignColumnId: z.string().optional(),
      })
    )
    .min(1, 'At least one column is required'),
});

// Explicitly define the form type
type FormValues = z.infer<typeof formSchema>;

type TableData = {
  id: string;
  name: string;
  columns: Array<{
    id: string;
    name: string;
    type: string;
    isNullable: boolean;
    isPrimary: boolean;
    isForeignKey: boolean;
    foreignTableId?: string;
    foreignColumnId?: string;
  }>;
};

const TableEditorForDatabase = ({ params }: DatabasePageProps) => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize shadcn/ui form with explicit type
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      columns: [{ name: '', type: 'TEXT', isNullable: true, isPrimary: false, isForeignKey: false }],
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: 'columns',
  });

  // Fetch tables on mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const { databaseId } = await params;
        const tableList = await getTables(databaseId);
        setTables(tableList);
      } catch (err: any) {
        console.error('Error fetching tables:', err);
        setError(err.message || 'Failed to fetch tables');
      }
    };
    fetchTables();
  }, [params]);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const { databaseId } = await params;
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('columns', JSON.stringify(values.columns));

      await createTable(databaseId, formData);
      setIsOpen(false);
      form.reset();
      const tableList = await getTables(databaseId);
      setTables(tableList);
    } catch (err: any) {
      console.error('Error creating table:', err);
      setError(err.message || 'Failed to create table. Please try again.');
    }
  };

  const addColumn = () => {
    append({ name: '', type: 'TEXT', isNullable: true, isPrimary: false, isForeignKey: false });
  };

  return (
    <div className="flex w-full min-h-screen bg-dark">
      {/* Left Sidebar */}
      <div className="w-full md:w-64 bg-hover border-r border-white/10 p-4 flex-shrink-0">
        <h2 className="text-2xl font-bold text-white mb-4">Tables</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {tables.length === 0 ? (
          <p className="text-white/75">No tables found. Create one to get started!</p>
        ) : (
          <ul className="space-y-2">
            {tables.map((table) => (
              <li
                key={table.id}
                className="p-2 rounded-md hover:bg-[#1a1a1a] text-white/75 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
              >
                <Table className="h-5 w-5 text-green" />
                <span>{table.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Table Editor</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Table Card */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <div className="bg-hover border border-white/10 rounded-lg p-6 hover:bg-[#1a1a1a] transition-colors cursor-pointer flex flex-col items-center justify-center h-48">
                <Plus className="h-12 w-12 text-green mb-4" />
                <h3 className="text-xl font-semibold text-white">Create New Table</h3>
                <p className="text-white/75 mt-2 text-center">Add a new table to your database</p>
              </div>
            </DialogTrigger>
            <DialogContent className="w-full sm:w-1/2 max-w-[600px] bg-dark border border-white/10 p-6">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">Create New Table</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                  {/* Table Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Table Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Table className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                            <Input
                              {...field}
                              className="pl-10 w-full bg-[#171717] border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-main"
                              placeholder="Enter table name"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Columns */}
                  <div>
                    <h4 className="text-white font-medium mb-2">Columns</h4>
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name={`columns.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-white">Column Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="bg-[#171717] border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-main"
                                  placeholder="Enter column name"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`columns.${index}.type`}
                          render={({ field }) => (
                            <FormItem className="w-32">
                              <FormLabel className="text-white">Type</FormLabel>
                              <FormControl>
                                <select
                                  {...field}
                                  className="w-full bg-[#171717] border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-main"
                                  onChange={(e) => field.onChange(e.target.value)}
                                >
                                  <option value="TEXT">TEXT</option>
                                  <option value="INTEGER">INTEGER</option>
                                  <option value="BOOLEAN">BOOLEAN</option>
                                  <option value="DATE">DATE</option>
                                  <option value="FLOAT">FLOAT</option>
                                </select>
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={addColumn}
                      className="bg-main text-white px-4 py-2 rounded-md hover:bg-[#007a4a] transition-colors"
                    >
                      Add Column
                    </Button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <p className="text-red-500">{error}</p>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="bg-main text-white px-6 py-3 rounded-md hover:bg-[#007a4a] transition-colors disabled:opacity-50 flex items-center gap-2 w-full"
                  >
                    {form.formState.isSubmitting ? 'Creating...' : (
                      <>
                        <Save className="h-5 w-5" />
                        Create Table
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default TableEditorForDatabase;