import { ProjectsSchema, ProjectsValues } from '@/lib/resumeSchema'
import { ResumeEditorFormProps } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

const ProjectsForm = ({resumeData,setResumeData}: ResumeEditorFormProps) => {
  const form = useForm<ProjectsValues>({
          resolver: zodResolver(ProjectsSchema),
          defaultValues: {
              projects: resumeData.projects || [],
          }
      })

      
  return (
    <div>ProjectsForm</div>
  )
}

export default ProjectsForm