"use server"

import { generateApiKey, generateSlug } from "@/lib/helpers"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"


export const createNewProject = async (formData: FormData) => {
    const userId = (await cookies()).get('session_token')?.value
    try {
      const name = formData.get('name') as string
      const description = formData.get('description') as string
      let slug = generateSlug(name)
      let slugSuffix = 1
      let uniqueSlug = slug
      while (await prisma.project.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${slugSuffix}`
        slugSuffix++
      }
  
      if (!userId) {
        throw new Error('User ID is required to create a project');
      }
      
      const response = await prisma.project.create({
        data: {
          name,
          description,
          creatorId: userId,
          slug: uniqueSlug,
        },
      })
  
      const apiKey = generateApiKey()
      await prisma.apiKey.create({
        data: {
          name:`${response.name} Api Key`,
          key: apiKey,
          projectId: response.id,
        },
      })
  
      return {
        success: true,
        status: 201,
      }
    } catch (error) {
      console.error('Error creating project:', error)
      throw new Error('Error creating project: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }
export const getAllProjects = async () => {
    const cookie = await cookies()
    const userId = cookie.get('session_token')?.value as string

    try {
        const response = await prisma.project.findMany({
            where: {
                creatorId: userId,
            },
            select:{
              description:true,
              ApiKey:true,
              Bucket:true,
              database:true,
              id:true,
              name:true,
              slug:true,
              created_at:true
            }
        });

        return response;
    } catch (error) {
        throw new Error("Error fetching projects");
    }
};

export const getProject = async (slug:string) => {
    try {
        const response = await prisma.project.findUnique({
            where: {
                slug,
            },
            select:{
              id:true,
              ApiKey:true,
              Bucket:true,
              database:true,
              creator:true,
              AuthUser:true,
              created_at:true,
              creatorId:true,
              description:true,
              name:true,
              updated_at:true,
              slug:true
            }
        });

        return response;
    } catch (error) {
        throw new Error("Error fetching project");
    }
};

export const deleteProject = async (id:string) => {
    try {
        const response = await prisma.project.delete({
            where: {
                id,
            },
        });

        return response;
    } catch (error) {
        throw new Error("Error deleting project");
    }
};
