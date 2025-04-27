import React from 'react'

const AuthLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <main className='w-full min-h-screen items-center justify-center flex flex-col'>
        {children}
    </main>
  )
}

export default AuthLayout