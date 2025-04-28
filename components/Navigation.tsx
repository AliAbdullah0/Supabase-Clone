"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { NavLink } from './ui/NavLink';
import { PrimaryButton } from './ui/PrimaryButton';
import { useCurrentUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

const Navigation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const router = useRouter()
  
  const user = useCurrentUser()
  // if(user) router.push('/dashboard')

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileProducts = () => setIsMobileProductsOpen(!isMobileProductsOpen);

  return (
    <nav className={cn('bg-dark text-neutral-100 border-b border-b-white/10')}>
      <div className="flex items-center justify-between px-10 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <NavLink href="/" className="flex items-center hover:text-neutral-100 gap-2">
            <Image
              src="/supabase-logo-icon.png"
              alt="Supabase Logo"
              height={25}
              width={25}
              className="object-contain"
            />
            <h1 className="font-bold text-xl text-neutral-100">supabase</h1>
          </NavLink>
          <ul className="hidden md:flex items-center gap-4 ml-8">
            <li
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className={cn(
                  'bg-transparent mt-0.5 hover:bg-hover flex items-center gap-1 text-neutral-100 hover:text-main text-sm font-medium px-4 py-2 rounded',
                  'transition-colors duration-200'
                )}
              >
                Products
              </button>
              {isDropdownOpen && (
                <div
                  className={cn(
                    'absolute bg-hover text-white p-4 rounded-md shadow-lg w-[300px] mt-2',
                    '!bg-hover'
                  )}
                >
                  <ul className="flex flex-col gap-2">
                    <li>
                      <NavLink
                        href="/products/database"
                        className={cn(
                          'block px-4 py-2 hover:bg-main rounded',
                          'transition-colors duration-200'
                        )}
                      >
                        Database
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        href="/products/auth"
                        className={cn(
                          'block px-4 py-2 hover:bg-main rounded',
                          'transition-colors duration-200'
                        )}
                      >
                        Auth
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        href="/products/storage"
                        className={cn(
                          'block px-4 py-2 hover:bg-main rounded',
                          'transition-colors duration-200'
                        )}
                      >
                        Storage
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        href="/products/realtime"
                        className={cn(
                          'block px-4 py-2 hover:bg-main rounded',
                          'transition-colors duration-200'
                        )}
                      >
                        Realtime
                      </NavLink>
                    </li>
                  </ul>
                </div>
              )}
            </li>
            <li>
              <NavLink href="/developers">Developers</NavLink>
            </li>
            <li>
              <NavLink href="/pricing">Pricing</NavLink>
            </li>
            <li>
              <NavLink href="/docs">Docs</NavLink>
            </li>
            <li>
              <NavLink href="/community">Community</NavLink>
            </li>
          </ul>
        </div>
        <div className="hidden md:block">
          <PrimaryButton to={user?"/dashboard":"/sign-in"} text={ user ? "Dashboard" : "Sign In"} />
        </div>
        <button
          className="md:hidden text-neutral-100 focus:outline-none"
          onClick={toggleSidebar}
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
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      <div
        className={cn(
          'fixed inset-y-0 left-0 w-64 bg-dark text-neutral-100 transform',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'transition-transform duration-300 ease-in-out md:hidden z-50 border-r border-white/10'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <NavLink href="/" className="flex items-center gap-2">
            <Image
              src="/supabase-logo-icon.png"
              alt="Supabase Logo"
              height={25}
              width={25}
              className="object-contain"
            />
            <h1 className="font-bold text-xl text-neutral-100">supabase</h1>
          </NavLink>
          <button
            className="text-neutral-100 focus:outline-none"
            onClick={toggleSidebar}
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
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col gap-2 p-4">
          <li>
            <button
              className={cn(
                'w-full text-left bg-transparent hover:bg-hover text-neutral-100 hover:text-main text-sm font-medium px-4 py-2 rounded flex items-center justify-between',
                'transition-colors duration-200'
              )}
              onClick={toggleMobileProducts}
            >
              Products
              <svg
                className={cn(
                  'w-4 h-4 transform',
                  isMobileProductsOpen ? 'rotate-180' : 'rotate-0'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isMobileProductsOpen && (
              <ul className="flex flex-col gap-2 pl-4 mt-2">
                <li>
                  <NavLink
                    href="/products/database"
                    className={cn(
                      'block px-4 py-2 hover:bg-main rounded',
                      'transition-colors duration-200'
                    )}
                  >
                    Database
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    href="/products/auth"
                    className={cn(
                      'block px-4 py-2 hover:bg-main rounded',
                      'transition-colors duration-200'
                    )}
                  >
                    Auth
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    href="/products/storage"
                    className={cn(
                      'block px-4 py-2 hover:bg-main rounded',
                      'transition-colors duration-200'
                    )}
                  >
                    Storage
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    href="/products/realtime"
                    className={cn(
                      'block px-4 py-2 hover:bg-main rounded',
                      'transition-colors duration-200'
                    )}
                  >
                    Realtime
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink href="/developers" className="block px-4 py-2">
              Developers
            </NavLink>
          </li>
          <li>
            <NavLink href="/pricing" className="block px-4 py-2">
              Pricing
            </NavLink>
          </li>
          <li>
            <NavLink href="/docs" className="block px-4 py-2">
              Docs
            </NavLink>
          </li>
          <li>
            <NavLink href="/community" className="block px-4 py-2">
              Community
            </NavLink>
          </li>
          <li className="px-4 py-2 ">
          <PrimaryButton to={user?"/dashboard":"/sign-in"} text={ user ? "Dashboard" : "Sign In"} />
          </li>
        </ul>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={toggleSidebar}
        />
      )}
    </nav>
  );
};

export default Navigation;