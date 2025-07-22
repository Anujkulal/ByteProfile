import { Metadata } from 'next'
import React from 'react'
import ResumeEditorClient from './ResumeEditorClient'

export const metadata: Metadata = {
    title: 'Resume Editor',
}

const ResumeEditorPage = () => {
  return (
    <ResumeEditorClient />
  )
}

export default ResumeEditorPage