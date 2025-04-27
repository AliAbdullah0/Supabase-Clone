import { getCurrentUser } from '@/actions/user.actions'
import DashboardSideBar from '@/components/DashboardSideBar'
import UserMenu from '@/components/UserMenu'
import UserProvider from '@/context/UserContext'
import { InfoIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const DashboardLayout = async ({children}:{children:React.ReactNode}) => {
  const user = await getCurrentUser()
  return (
    <UserProvider>
    <main className='flex h-screen text-neutral-100 w-full overflow-x-hidden'>
        <DashboardSideBar/>
      <section className='flex-1'>
      <div className='flex gap-2 items-center justify-end px-6 py-[9.9px] border border-b border-white/10'>
        <div className='flex gap-2 items-center'>
          <button className='bg-transparent hover:bg-[#171717] hover:transiton-colors border border-white/10 rounded-md text-xs px-3 py-1'>Feedback</button>
          <Link href={''}><InfoIcon className='text-white/75 h-4 w-4 mr-1 hover:bg-[#171717]'/></Link>
        </div>
        <UserMenu user={user}/>
      </div>
      <div className='flex-1 '>
      {children}
      </div>
      </section>
    </main>
    </UserProvider>
  )
}

export default DashboardLayout