"use server"

import prisma from "@/lib/prisma"
import { getProject } from '@/actions/project.actions';
import { TableForm } from "@/types";
import { getCurrentUser } from "./user.actions";
import { Prisma } from "@prisma/client";

export async function createDatabase(projectId: string, formData: FormData) {
  const name = formData.get('name') as string;
  try {
    if (!name || name.trim() === '') {
      throw new Error('Database name is required');
    }
    const existingDatabase = await prisma.database.findUnique({
      where:{
        name,
      }
    })
    if(existingDatabase) throw new Error("There is already a database with this name")
    const response = await prisma.database.create({
      data: {
        name,
        projectId,
      },
    });

    return { success: true, status: 201 };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('A database with this name already exists');
    }
    console.error('Error creating database:', error);
    throw new Error(error.message || 'Failed to create database');
  }
}



export async function getAllDatabases(projectId: string) {
  try {
    const response = await prisma.database.findMany({
      where: {
        projectId,
      },
    });
    return response;
  } catch (error) {
    console.error('Error getting databases:', error);
    throw new Error('Failed to fetch databases');
  }
}

export async function getDatabaseById(databaseId: string) {
  try {
    const database = await prisma.database.findUnique({
      where: {
        id: databaseId,
      },
      include: {
        project: true,
        tables: {
          select: {
            id: true,
            name: true,
            columns:true,
            database:true,
            userSchema:true,
            databaseId:true,
            updated_at:true,
            created_at:true,
          },
        },
      },
    });

    return database;
  } catch (error) {
    console.error('Error fetching database:', error);
    throw new Error('Failed to fetch database');
  }
}

export async function getTables(databaseId: string) {
  try {
    const database = await getDatabaseById(databaseId);
    if (!database) {
      return [];
    }

    const tables = await prisma.table.findMany({
      where: {
        databaseId: databaseId,
      },
      include: {
        columns: {
          select: {
            id: true,
            name: true,
            foreignColumnId:true,
            foreignTableId:true,
            isPrimary:true,
            isForeignKey:true,
            isNullable:true,
            type:true,
            updatedAt:true,
            createdAt:true,
          },
        },
      },
    });

    return tables.map((table) => ({
      id: table.id,
      name: table.name,
      columns: table.columns,
    }));
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw new Error('Failed to fetch tables');
  }
}

export async function createTable(databaseId: string, formData: FormData) {
  const name = formData.get('name') as string;
  const columns = JSON.parse(formData.get('columns') as string) as Array<{
    name: string;
    type: string;
    isNullable: boolean;
    isPrimary: boolean;
    isForeignKey: boolean;
    foreignTableId?: string;
    foreignColumnId?: string;
  }>;
  try {
    if (!name || name.trim() === '') {
      throw new Error('Table name is required');
    }
    if (!columns || columns.length === 0) {
      throw new Error('At least one column is required');
    }
    const database = await prisma.database.findUnique({
      where: { id: databaseId },
    });
    if (!database) {
      throw new Error('Database not found');
    }
    const response = await prisma.table.create({
      data: {
        name,
        databaseId,
        columns: {
          create: columns.map((col) => ({
            name: col.name,
            type: col.type,
            isNullable: col.isNullable,
            isPrimary: col.isPrimary,
            isForeignKey: col.isForeignKey,
            foreignTableId: col.foreignTableId,
            foreignColumnId: col.foreignColumnId,
          })),
        },
      },
    });
    return { success: true, status: 201 };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('A table with this name already exists');
    }
    console.error('Error creating table:', error);
    throw new Error(error.message || 'Failed to create table');
  }
}

export const getTableById = async (tableId:string)=>{
  try {
    const response = await prisma.table.findUnique({
      where: {
        id: tableId,
      },
      include: {
        columns: {
          select: {
            id: true,
            name: true,
            foreignColumnId:true,
            foreignTableId:true,
            isPrimary:true,
            isForeignKey:true,
            isNullable:true,
            type:true,
            updatedAt:true,
            createdAt:true,
          },
        },
      },
    })
    return response;
  } catch (error) {
    throw new Error("Error Fetching Table")
  }
}