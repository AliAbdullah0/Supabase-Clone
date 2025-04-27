import React from 'react'

const ProjectCardSkeleton = () => {
  return (
    <div className="bg-[#171717] rounded-lg border border-white/10 shadow-md p-6 w-full max-w-sm animate-pulse">
      {/* Title skeleton */}
      <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
      {/* Description skeleton */}
      <div className="h-4 bg-white/10 rounded w-full mb-4"></div>
      <div className="h-4 bg-white/10 rounded w-5/6 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-3 bg-white/10 rounded w-1/3"></div>
        <div className="h-3 bg-white/10 rounded w-1/4"></div>
      </div>
    </div>
  )
}

const ButtonSkeleton = () => {
  return (
    <div className="h-8 w-28 bg-white/10 rounded-md animate-pulse"></div>
  )
}

const ProjectsLoading = () => {
  return (
    <div className="min-h-screen bg-dark">
      <div className="flex items-center mb-6">
        <ButtonSkeleton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

export default ProjectsLoading