import { getAllProjects } from '@/actions/project.actions'
import ProjectActionBar from '@/components/ProjectActionBar'
import ProjectCard from '@/components/ProjectCard'
import ProjectsLoading from '@/components/ProjectsLoading'
import React, { Suspense } from 'react'

const Dashboard = async () => {
  const projects = await getAllProjects()
  return (
    <Suspense fallback={<ProjectsLoading/>}>
    <section className='flex flex-col w-full p-5'>
      <ProjectActionBar/>
      <div className='mt-4 flex md:flex-row flex-col gap-4 flex-wrap'>
        { projects.length > 0 ? (
          projects.map((project)=>(
            <ProjectCard key={project.id} name={project.name} description={project.description ?? "No Description Provided"} created_at={project.created_at.toLocaleDateString()} slug={project.slug}/>
          ))
        ) : (
          <p className='text-white/65 mt-2 text-center'>You Don't have any projets yet.</p>
        )
        }
      </div>
    </section>
    </Suspense>
  )
}

export default Dashboard