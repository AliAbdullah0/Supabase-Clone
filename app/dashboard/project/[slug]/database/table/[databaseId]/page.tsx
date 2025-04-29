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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, Plus, Save, Loader2 } from 'lucide-react';
import TablesList from '@/components/TablesList';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(1, 'Table name is required').max(100, 'Table name must be 100 characters or less'),
  columns: z
    .array(
      z.object({
        name: z.string().min(1, 'Column name is required'),
        type: z.enum(['TEXT', 'INTEGER', 'BOOLEAN', 'DATE', 'FLOAT']),
        isNullable: z.boolean(),
        isPrimary: z.boolean(),
        isForeignKey: z.boolean(),
        foreignTableId: z.string().optional(),
        foreignColumnId: z.string().optional(),
      })
    )
    .min(1, 'At least one column is required')
    .superRefine((columns, ctx) => {
      const primaryKeys = columns.filter(col => col.isPrimary);
      if (primaryKeys.length > 1) {
        primaryKeys.forEach((col, index) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`columns.${index}.isPrimary`],
            message: 'Only one column can be set as primary key',
          });
        });
      }

      columns.forEach((col, index) => {
        if (col.isForeignKey) {
          if (!col.foreignTableId) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`columns.${index}.foreignTableId`],
              message: 'Foreign table must be selected for foreign key',
            });
          }
          if (!col.foreignColumnId) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`columns.${index}.foreignColumnId`],
              message: 'Foreign column must be selected for foreign key',
            });
          }
        }
      });
    }),
});

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
    foreignTableId: string | null;
    foreignColumnId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

const TableEditorForDatabase = ({ params }: DatabasePageProps) => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [paramsId, setParamsId] = useState('');

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

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const { databaseId } = await params;
        setParamsId(databaseId);
        const tableList = await getTables(databaseId);
        setTables(tableList);
      } catch (err: any) {
        console.error('Error fetching tables:', err);
        setError(err.message || 'Failed to fetch tables');
      }
    };
    fetchTables();
  }, [params]);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      const { databaseId } = await params;
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('columns', JSON.stringify(data.columns));

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
    <div className="flex w-full bg-dark min-h-screen">
      <TablesList tables={tables} error={error} databaseId={paramsId} />

      <div className="flex-1 p-4 sm:p-8 overflow-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-100 mb-6 border-b border-white/10 pb-4">Table Editor</h1>
        <div className="grid grid-cols-1 gap-6">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <div className="bg-hover border border-white/10 rounded-lg p-4 hover:bg-[#1a1a1a] transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[150px]">
                <Plus className="h-8 w-8 text-green mb-2" />
                <h3 className="text-lg font-semibold text-neutral-100">Create New Table</h3>
                <p className="text-white/75 mt-1 text-sm text-center">Add a new table to your database</p>
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-full md:w-1/2 max-w-[800px] bg-dark border-l border-white/10 p-6 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-neutral-100 text-2xl">Create New Table</SheetTitle>
              </SheetHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-100 font-medium">Table Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Table className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                            <Input
                              {...field}
                              className="pl-10 w-full bg-[#171717] border border-white/10 rounded-md p-3 text-neutral-100 focus:outline-none focus:border-main"
                              placeholder="Enter table name"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <div>
                    <h4 className="text-neutral-100 font-medium mb-2">Columns</h4>
                    {fields.map((field, index) => (
                      <div key={field.id} className="border border-white/10 rounded-md p-4 mb-4">
                        <div className="flex gap-4 mb-4">
                          <FormField
                            control={form.control}
                            name={`columns.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel className="text-neutral-100">Column Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="bg-[#171717] border border-white/10 rounded-md p-3 text-neutral-100 focus:outline-none focus:border-main"
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
                                <FormLabel className="text-neutral-100">Type</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger className="bg-[#171717] border border-white/10 text-neutral-100">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#171717] border-white/10 text-neutral-100">
                                      <SelectItem value="TEXT">TEXT</SelectItem>
                                      <SelectItem value="INTEGER">INTEGER</SelectItem>
                                      <SelectItem value="BOOLEAN">BOOLEAN</SelectItem>
                                      <SelectItem value="DATE">DATE</SelectItem>
                                      <SelectItem value="FLOAT">FLOAT</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <FormField
                            control={form.control}
                            name={`columns.${index}.isNullable`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="border-white/50"
                                  />
                                </FormControl>
                                <FormLabel className="text-white">Nullable</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`columns.${index}.isPrimary`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="border-white/50"
                                  />
                                </FormControl>
                                <FormLabel className="text-neutral-100">Primary Key</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`columns.${index}.isForeignKey`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="border-white/50"
                                  />
                                </FormControl>
                                <FormLabel className="text-neutral-100">Foreign Key</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                        {form.watch(`columns.${index}.isForeignKey`) && (
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`columns.${index}.foreignTableId`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-neutral-100">Foreign Table</FormLabel>
                                  <FormControl>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <SelectTrigger className="bg-[#171717] border border-white/10 text-neutral-100">
                                        <SelectValue placeholder="Select table" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-[#171717] border-white/10 text-neutral-100">
                                        {tables.map((table) => (
                                          <SelectItem key={table.id} value={table.id}>
                                            {table.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage className="text-red-500" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`columns.${index}.foreignColumnId`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-neutral-100">Foreign Column</FormLabel>
                                  <FormControl>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      disabled={!form.watch(`columns.${index}.foreignTableId`)}
                                    >
                                      <SheetTrigger className="bg-[#171717] border border-white/10 text-neutral-100">
                                        <SelectValue placeholder="Select column" />
                                      </SheetTrigger>
                                      <SelectContent className="bg-[#171717] border-white/10 text-neutral-100">
                                        {form.watch(`columns.${index}.foreignTableId`) &&
                                          tables
                                            .find(t => t.id === form.watch(`columns.${index}.foreignTableId`))
                                            ?.columns.map((column) => (
                                              <SelectItem key={column.id} value={column.id}>
                                                {column.name}
                                              </SelectItem>
                                            ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage className="text-red-500" />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={addColumn}
                      className="bg-main text-neutral-100 px-4 py-2 rounded-md hover:bg-[#007a4a] transition-colors"
                    >
                      Add Column
                    </Button>
                  </div>
                  {error && <p className="text-red-500">{error}</p>}

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="bg-main text-neutral-100 px-6 py-3 rounded-md hover:bg-[#007a4a] transition-colors disabled:opacity-50 flex items-center gap-2 w-full"
                  >
                    {form.formState.isSubmitting ? (
                      <p className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating
                      </p>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Create Table
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default TableEditorForDatabase;