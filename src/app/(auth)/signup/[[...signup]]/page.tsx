import { SignUp } from '@clerk/nextjs'
import React from 'react'

const SignupPage = () => {
  return (
    <main className='h-screen flex items-center justify-center p-2'>
        <SignUp />
    </main>
  )
}

export default SignupPage