"use client";

import React from "react";
import { Table as TableIcon } from "lucide-react";

type Table = {
  id: string;
  name: string;
};

type TablesListProps = {
  tables: Table[];
  error?: string | null;
};

const TablesList: React.FC<TablesListProps> = ({ tables, error }) => {
  return (
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
              <TableIcon className="h-5 w-5 text-green" />
              <span>{table.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TablesList;
