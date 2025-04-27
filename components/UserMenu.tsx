"use client"
import { signOutUser } from '@/actions/user.actions'
import { User as UserType } from '@/types'
import React, { useState, useRef, useEffect } from 'react'
import { User, Settings, Mail, LogOut } from 'lucide-react'

const UserMenu = ({ user }: { user: UserType }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const menuOptions = [
    { label: 'Account', href: '/account', icon: User },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Contact', href: '/contact', icon: Mail },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="rounded-full cursor-pointer border border-white/10 bg-white flex items-center justify-center w-8 h-8 text-neutral-700 focus:outline-none hover:bg-gray-100 transition-colors"
        aria-label="User menu"
      >
        <User className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#171717] rounded-md shadow-lg z-50 border border-white/10">
          <div className="flex flex-col">
            {menuOptions.map((option, index) => (
              <a
                key={option.label}
                href={option.href}
                className={`px-4 py-2 text-sm text-white/90 hover:bg-[#171717] transition-colors flex items-center gap-2 ${
                  index < menuOptions.length - 1 ? 'border-b border-white/10' : ''
                }`}
              >
                <option.icon className="w-4 h-4 text-white/90" />
                {option.label}
              </a>
            ))}
            <button
              onClick={async () => {
                await signOutUser()
                setIsOpen(false)
              }}
              className="px-4 py-2 text-sm text-white/90 hover:bg-[#171717] transition-colors text-left border-t border-white/10 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4 text-white/90" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu