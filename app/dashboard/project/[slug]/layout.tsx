import { getProject } from '@/actions/project.actions';
import ProjectPageSideBar from '@/components/ProjectPageSideBar'
import React from 'react'

interface ProjectPageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

const ProjectPageLayout = async ({ children, params }: ProjectPageLayoutProps) => {
  const { slug } = await params; 
  const project = await getProject(slug)
  return (
    <main className="flex h-screen">
      <section className="flex-1">{children}</section>
      <ProjectPageSideBar slug={slug} project={project}/> 
    </main>
  );
};

export default ProjectPageLayout;
