import React from 'react'
import Link from 'next/link'
import { Project } from '@/types' // Assuming a Project type is defined

interface ProjectCardProps {
  name: string;
  description: string;
  created_at:string;
  slug:string;
}

const ProjectCard = ({ name,description,created_at,slug }:ProjectCardProps) => {

  return (
    <Link href={`/dashboard/project/${slug}`}>
      <div className="bg-[#171717] rounded-lg border border-white/10 shadow-md hover:shadow-lg hover:bg-[#1e1e1e] transition-all duration-200 px-6 py-8 w-full md:min-w-[400px]">
        <h3 className="text-lg font-medium text-white mb-2">{name}</h3>
        <p className="text-sm text-white/65 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-white/50">{created_at}</span>
          <span className="text-xs text-white/75 hover:text-white transition-colors cursor-pointer">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProjectCard