"use client";

import React from "react";
import { Table as TableIcon } from "lucide-react";
import Link from "next/link";

type Table = {
  id: string;
  name: string;
};

type TablesListProps = {
  tables: Table[];
  error?: string | null;
  databaseId?:string;
};

const TablesList: React.FC<TablesListProps> = ({ tables, error,databaseId }) => {
  return (
    <div className="w-full md:w-64 bg-hover border-r border-white/10 p-4 flex-shrink-0">
      <h2 className="text-2xl font-bold text-white mb-4">Tables</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {tables.length === 0 ? (
        <p className="text-white/75">No tables found. Create one to get started!</p>
      ) : (
        <div className="space-y-2">
          {tables.map((table) => (
            <Link
              key={table.id}
              href={`/${databaseId}/tables/${table.id}`}
              className="p-2 rounded-md hover:bg-[#1a1a1a] text-white/75 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
            >
              <TableIcon className="h-5 w-5 text-green" />
              <span>{table.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TablesList;
