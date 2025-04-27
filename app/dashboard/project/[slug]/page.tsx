import React from 'react'

type PageProps = { params: Promise<{ slug: string }> };

const ProjectPage = async ({params}:PageProps) => {
  const {slug} = await params;
  return (
    <div>ProjectPage</div>
  )
}

export default ProjectPage