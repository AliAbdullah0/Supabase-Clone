"use client"
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Table, LayoutGrid, Database, Settings, ChevronLeft } from 'lucide-react'
import { Project } from '@/types'

interface SidebarOption {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const ProjectPageSideBar = ({ slug, project }: { slug: string; project: Project }) => {
  const [isOpen, setIsOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const options: SidebarOption[] = [
    { label: 'Databases', href: `/dashboard/project/${slug}/database`, icon: Database },
    { label: 'Table Editor', href: `/dashboard/project/${slug}/table`, icon: Table },
    { label: 'Schema Builder', href: `/dashboard/project/${slug}/schema-builder`, icon: LayoutGrid },
    { label: 'Tables', href: `/dashboard/project/${slug}/tables`, icon: Table },
    { label: 'Project Settings', href: `/dashboard/project/${slug}/settings`, icon: Settings },
  ]

  return (
    <>
      {!isOpen && (
        <div className="md:hidden fixed top-16 right-2 z-50">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-[#171717] border border-white/10 rounded-full text-white/75 hover:text-white hover:bg-[#1e1e1e] transition-colors"
            aria-label="Open project sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}

      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 right-0 w-64 bg-[#171717] border-l border-white/10 h-screen transform transition-transform duration-300 ease-in-out z-40 md:static md:transform-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        } flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-4 md:border-b border-white/10">
          <h2 className="text-lg font-medium first-letter:uppercase text-white">{project?.name}</h2>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white/65 hover:text-white focus:outline-none"
            aria-label="Close sidebar"
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
        <div className="flex flex-col px-6 py-4 space-y-2">
          {options.map((option) => (
            <Link
              key={option.label}
              href={option.href}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white/90 hover:bg-[#1e1e1e] hover:text-white rounded-md transition-colors"
            >
              <option.icon className="w-4 h-4 text-white/75" />
              {option.label}
            </Link>
          ))}
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default ProjectPageSideBar