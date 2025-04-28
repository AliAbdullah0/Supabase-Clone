import { getProject } from '@/actions/project.actions';
import Badge from '@/components/ui/Badge';
import React from 'react';

type PageProps = { params: Promise<{ slug: string }> };

const ProjectPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const project = await getProject(slug);

  return (
    <div className="flex w-full flex-col px-7 py-8 bg-dark min-h-screen">
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-4xl first-letter:uppercase font-bold text-white">
            {project?.name} Project
          </h2>
          <Badge text="Project" className="mt-1.5 bg-main text-white" />
        </div>
        <p className="text-white/75 first-letter:uppercase text-lg max-w-2xl">
          {project?.description || 'No description provided.'}
        </p>
      </div>

      <div className="mt-10">
        <h3 className="font-medium text-2xl text-white">Welcome to Your New Project</h3>
        <p className="text-white/75 mt-2 max-w-2xl">
          Your project has been deployed on its own instance, with its own API all set up and ready to use.
        </p>
      </div>


      <div className="mt-12">
        <h3 className="font-medium text-2xl text-white">Explore Our Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          <div className="bg-hover border border-white/10 rounded-lg p-6 hover:bg-[#1a1a1a] transition-colors">
            <h4 className="text-xl font-semibold text-white">Authentication</h4>
            <p className="text-white/75 mt-3">
              Secure user authentication with our robust AuthUser system. Manage user access seamlessly.
            </p>
            <div className="mt-4">
              <span className="text-green text-sm">
                {project?.AuthUser?.length || 0} Users
              </span>
            </div>
          </div>
          <div className="bg-hover border border-white/10 rounded-lg p-6 hover:bg-[#1a1a1a] transition-colors">
            <h4 className="text-xl font-semibold text-white">Storage</h4>
            <p className="text-white/75 mt-3">
              Scalable storage solutions with our Bucket system for all your data needs.
            </p>
            <div className="mt-[38px]">
              <span className="text-green text-sm">
                {project?.Bucket?.length || 0} Buckets
              </span>
            </div>
          </div>

          <div className="bg-hover border border-white/10 rounded-lg p-6 hover:bg-[#1a1a1a] transition-colors">
            <h4 className="text-xl font-semibold text-white">Database</h4>
            <p className="text-white/75 mt-3">
              Reliable database management with our integrated Database system for efficient data handling.
            </p>
            <div className="mt-4">
              <span className="text-green text-sm">
                {project?.database ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-medium text-2xl text-white">Project Details</h3>
        <div className="mt-6 bg-hover border border-white/10 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-white/75">Project ID</p>
              <p className="text-white font-medium">{project?.id}</p>
            </div>
            <div>
              <p className="text-white/75">Slug</p>
              <p className="text-white font-medium">{project?.slug}</p>
            </div>
            <div>
              <p className="text-white/75">Created At</p>
              <p className="text-white font-medium">
                {project?.created_at.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-white/75">Last Updated</p>
              <p className="text-white font-medium">
                {project?.updated_at.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-white/75">API Keys</p>
              <p className="text-white font-medium">
                {project?.ApiKey?.length || 0} Keys
              </p>
            </div>
            <div>
              <p className="text-white/75">Creator</p>
              <p className="text-white font-medium">
                {project?.creator?.username || project?.creatorId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;