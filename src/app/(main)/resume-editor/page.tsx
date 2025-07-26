import { Metadata } from 'next'
import React from 'react'
import ResumeEditorClient from './ResumeEditorClient'
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { resumeDataInclude } from '@/lib/types';

export const metadata: Metadata = {
    title: 'Resume Editor',
}

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}

const ResumeEditorPage = async ({ searchParams }: PageProps) => {
  const { resumeId } = await searchParams;

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const resumeToEdit = resumeId
    ? await prisma.resume.findUnique({
        where: { id: resumeId, userId },
        include: resumeDataInclude,
      })
    : null;

  return (
    <ResumeEditorClient resumeToEdit={resumeToEdit} />
  )
}

export default ResumeEditorPage