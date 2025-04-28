// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// // import { createTable } from '@/actions/table.actions';
// import Badge from '@/components/ui/Badge';
// import { getTables } from '@/actions/database.actions';
// // import { getTables } from '@/actions/table.actions';

// type ColumnForm = {
//   name: string;
//   type: string;
//   isNullable: boolean;
//   isPrimary: boolean;
//   isForeignKey: boolean;
//   foreignTableId?: string;
//   foreignColumnId?: string;
// };

// type TableForm = {
//   name: string;
//   columns: ColumnForm[];
// };

// type Table = {
//   id: string;
//   name: string;
//   columns: { id: string; name: string }[];
// };

// const TableEditor = ({ params }: { params: Promise<{ slug: string }> }) => {
//   const router = useRouter();
//   const [form, setForm] = useState<TableForm>({ name: '', columns: [] });
//   const [tables, setTables] = useState<Table[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchTables = async () => {
//       const { slug } = await params;
//       const fetchedTables = await getTables(slug);
//       setTables(fetchedTables);
//     };
//     fetchTables();
//   }, [params]);

//   const addColumn = () => {
//     setForm({
//       ...form,
//       columns: [
//         ...form.columns,
//         {
//           name: '',
//           type: 'String',
//           isNullable: false,
//           isPrimary: false,
//           isForeignKey: false,
//         },
//       ],
//     });
//   };

//   const updateColumn = (index: number, field: keyof ColumnForm, value: any) => {
//     const updatedColumns = [...form.columns];
//     updatedColumns[index] = { ...updatedColumns[index], [field]: value };
//     setForm({ ...form, columns: updatedColumns });
//   };

//   const removeColumn = (index: number) => {
//     setForm({
//       ...form,
//       columns: form.columns.filter((_, i) => i !== index),
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setIsSubmitting(true);

//     try {
//       const { slug } = await params;
//       await createTable(slug, form);
//       router.push(`/projects/${slug}`);
//     } catch (err) {
//       setError('Failed to create table. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex w-full flex-col px-7 py-8 bg-dark min-h-screen">
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <h2 className="text-4xl font-bold text-white">Create New Table</h2>
//         <Badge text="Table Editor" className="mt-1.5 bg-main text-white" />
//       </div>
//       <p className="text-white/75 mt-2 max-w-2xl">
//         Design your database table by specifying its name and columns. Add foreign keys to create relationships with other tables.
//       </p>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="mt-8">
//         <div className="bg-hover border border-white/10 rounded-lg p-6">
//           {/* Table Name */}
//           <div className="mb-6">
//             <label className="text-white font-medium">Table Name</label>
//             <input
//               type="text"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//               className="mt-2 w-full bg-[#171717] border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-main"
//               placeholder="Enter table name"
//               required
//             />
//           </div>

//           {/* Columns */}
//           <div className="mb-6">
//             <div className="flex justify-between items-center">
//               <h3 className="text-xl font-medium text-white">Columns</h3>
//               <button
//                 type="button"
//                 onClick={addColumn}
//                 className="bg-main text-white px-4 py-2 rounded-md hover:bg-[#007a4a] transition-colors"
//               >
//                 Add Column
//               </button>
//             </div>

//             {form.columns.map((column, index) => (
//               <div key={index} className="mt-4 bg-[#171717] border border-white/10 rounded-md p-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Column Name */}
//                   <div>
//                     <label className="text-white/75">Column Name</label>
//                     <input
//                       type="text"
//                       value={column.name}
//                       onChange={(e) => updateColumn(index, 'name', e.target.value)}
//                       className="mt-1 w-full bg-dark border border-white/10 rounded-md p-2 text-white focus:outline-none focus:border-main"
//                       placeholder="Enter column name"
//                       required
//                     />
//                   </div>

//                   {/* Column Type */}
//                   <div>
//                     <label className="text-white/75">Type</label>
//                     <select
//                       value={column.type}
//                       onChange={(e) => updateColumn(index, 'type', e.target.value)}
//                       className="mt-1 w-full bg-dark border border-white/10 rounded-md p-2 text-white focus:outline-none focus:border-main"
//                     >
//                       <option value="String">String</option>
//                       <option value="Int">Integer</option>
//                       <option value="Boolean">Boolean</option>
//                       <option value="DateTime">DateTime</option>
//                       <option value="Float">Float</option>
//                     </select>
//                   </div>

//                   {/* Nullable */}
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={column.isNullable}
//                       onChange={(e) => updateColumn(index, 'isNullable', e.target.checked)}
//                       className="h-4 w-4 text-main bg-dark border-white/10 rounded"
//                     />
//                     <label className="text-white/75">Nullable</label>
//                   </div>

//                   {/* Primary Key */}
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={column.isPrimary}
//                       onChange={(e) => updateColumn(index, 'isPrimary', e.target.checked)}
//                       className="h-4 w-4 text-main bg-dark border-white/10 rounded"
//                     />
//                     <label className="text-white/75">Primary Key</label>
//                   </div>

//                   {/* Foreign Key */}
//                   <div className="col-span-2">
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={column.isForeignKey}
//                         onChange={(e) => updateColumn(index, 'isForeignKey', e.target.checked)}
//                         className="h-4 w-4 text-main bg-dark border-white/10 rounded"
//                       />
//                       <label className="text-white/75">Foreign Key</label>
//                     </div>

//                     {column.isForeignKey && (
//                       <div className="mt-4 grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="text-white/75">Foreign Table</label>
//                           <select
//                             value={column.foreignTableId || ''}
//                             onChange={(e) => updateColumn(index, 'foreignTableId', e.target.value)}
//                             className="mt-1 w-full bg-dark border border-white/10 rounded-md p-2 text-white focus:outline-none focus:border-main"
//                             required={column.isForeignKey}
//                           >
//                             <option value="">Select Table</option>
//                             {tables.map((table) => (
//                               <option key={table.id} value={table.id}>
//                                 {table.name}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div>
//                           <label className="text-white/75">Foreign Column</label>
//                           <select
//                             value={column.foreignColumnId || ''}
//                             onChange={(e) => updateColumn(index, 'foreignColumnId', e.target.value)}
//                             className="mt-1 w-full bg-dark border border-white/10 rounded-md p-2 text-white focus:outline-none focus:border-main"
//                             required={column.isForeignKey}
//                           >
//                             <option value="">Select Column</option>
//                             {column.foreignTableId &&
//                               tables
//                                 .find((t) => t.id === column.foreignTableId)
//                                 ?.columns.map((col) => (
//                                   <option key={col.id} value={col.id}>
//                                     {col.name}
//                                   </option>
//                                 ))}
//                           </select>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => removeColumn(index)}
//                   className="mt-4 text-red-500 hover:text-red-400"
//                 >
//                   Remove Column
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Error Message */}
//           {error && (
//             <p className="text-red-500 mt-4">{error}</p>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-main text-white px-6 py-3 rounded-md hover:bg-[#007a4a] transition-colors disabled:opacity-50"
//           >
//             {isSubmitting ? 'Creating...' : 'Create Table'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default TableEditor;