import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SigninPage = () => {
  return (
    <main className='h-screen flex items-center justify-center p-2'>
        <SignIn 
        fallbackRedirectUrl="/resumes"
        />
    </main>
  )
}

export default SigninPage