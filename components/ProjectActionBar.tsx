"use client"
import React, { useState } from 'react'
import ActionButton from './ui/ActionButton'
import { createNewProject } from '@/actions/project.actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const ProjectActionBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formStatus, setFormStatus] = useState<{ success?: boolean; error?: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => {
    setIsModalOpen(false)
    setFormStatus(null)
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      const result = await createNewProject(formData)
      setFormStatus({ success: result.success })
      if (result.success) {
        toast.success("Project created successfully")
        closeModal()
      }
    } catch (error) {
      toast.error("Error Creating Project!")
      setFormStatus({ error: error instanceof Error ? error.message : 'Error creating project' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex items-center">
        <ActionButton text="New Project" onClick={openModal} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#171717] rounded-lg w-full max-w-md border border-white/10 shadow-lg transform transition-all duration-300">
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-medium text-white">Create New Project</h2>
              <button
                onClick={closeModal}
                className="text-white/65 hover:text-white focus:outline-none"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form action={handleSubmit} className="px-6 py-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 bg-[#171717] border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Enter project name"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-white/90 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="w-full px-3 py-2 bg-[#171717] border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Enter project description"
                />
              </div>
              {formStatus?.success && (
                <p className="text-green-500 text-sm mb-4">Project created successfully!</p>
              )}
              {formStatus?.error && (
                <p className="text-red-500 text-sm mb-4">{formStatus.error}</p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-white/65 hover:text-white hover:bg-[#2a2a2a] rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm bg-white text-neutral-700 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? <p className='flex items-center justify-center'><Loader2 className="animate-spin h-4 w-4 mr-2"/>Creating...</p> : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default ProjectActionBar