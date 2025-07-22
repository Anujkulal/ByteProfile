"use client"

import { Button } from '@/components/ui/button'
import { MoveLeft, MoveRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ResumeEditorClient = () => {
  return (
   <div className="flex grow flex-col">
    <header className='space-y-1.5 border-b px-3 py-5 text-center'>
      <h1 className='text-lg font-semibold'>Resume Editor</h1>
      <p className='text-sm text-muted-foreground'>Edit your resume details below</p>
    </header>
    <main className='relative grow'>
      <div className="absolute bottom-0 top-0 flex w-full">
        <div className="w-full md:w-1/2">left</div>
        <div className="grow md:border-r" />
        <div className="hidden w-1/2 md:flex">right</div>
      </div>
    </main>
    <footer className='w-full border-t px-3 py-5'>
    <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-2">
      <div className="flex items-center gap-3">
        <Button variant={"secondary"}><MoveLeft /></Button>
        <Button><MoveRight /></Button>
      </div>
      <div className="flex items-center gap-3">
        <Button variant={"secondary"} asChild>
          <Link href={"/resumes"}>Close</Link>
        </Button>
        <span className='text-muted-foreground opacity-0'>Saving...</span>
      </div>
    </div>
    </footer>
   </div>
  )
}

export default ResumeEditorClient