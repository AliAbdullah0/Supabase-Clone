"use client"
import { ArrowDownLeft } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { Heading } from './ui/Heading'
import Image from 'next/image'


const DashboardSideBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 w-full bg-dark z-50 border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-3">
          <h2 className="font-medium text-lg text-white">Supabase</h2>
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-dark border-r border-white/10 min-h-screen transform transition-transform duration-300 ease-in-out z-40 md:static md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col`}
      >
        <div className="flex px-6 py-3 border-b border-white/10 w-full">
          <h2 className="font-medium text-lg text-white flex items-center gap-3"><Image src={'/supabase-logo-icon.png'} alt='Logo' height={28} width={28}/> Supabase</h2>
        </div>

        <div className="flex flex-col px-6 py-6 border-b border-white/10 w-full">
          <Heading  text="Projects" className="text-white/65" />
          <Heading to='/dashboard' text="All Projects" />
        </div>
        <div className="flex flex-col px-6 py-6 border-b border-white/10 w-full">
          <Heading text="Databases" className="text-white/65" />
          <Heading text="Storage" className="text-white/75" />
        </div>
        <div className="flex flex-col px-6 py-6 border-b border-white/10 w-full">
          <Heading text="Account" className="text-white/65" />
          <Heading text="API Keys" className="text-white/75" />
          <Heading text="Permissions" className="text-white/75" />
          <Heading text="Security" className="text-white/75" />
        </div>
        <div className="flex flex-col px-6 py-6 border-b border-white/10 w-full">
          <Heading text="Documentation" className="text-white/65" />
          <div className="flex items-center gap-0.5">
            <ArrowDownLeft className="text-white/75 h-3" />
            <Heading text="Guides" className="text-white/75" />
          </div>
          <div className="flex items-center gap-0.5">
            <ArrowDownLeft className="text-white/75 h-3" />
            <Heading text="API Reference" className="text-white/75" />
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-dark/50 z-30 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default DashboardSideBar