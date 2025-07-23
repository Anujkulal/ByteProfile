import { generalInfoSchema, generalInfoValues } from '@/lib/resumeSchema'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ResumeEditorFormProps } from '@/lib/types'

const GeneralInfoForm = ({resumeData, setResumeData}: ResumeEditorFormProps) => {
  const form = useForm<generalInfoValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      title: resumeData.title || "",
      description: resumeData.description || "",
    }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
    setResumeData({...resumeData, ...values})
  });

  return () => subscription.unsubscribe();

  }, [form.watch, setResumeData]);
  return (
    <div className='max-w-xl mx-auto space-y-8'>
      <div className="space-y-1.5 text-center">
        <h2 className='text-2xl font-semibold'>General info</h2>
        <p className="text-sm text-muted-foreground">This will not appear on your resume</p>
      </div>
      <Form {...form}>
        <form className='space-y-3'>
          <FormField control={form.control} name='title' render={({field}) => (
            <FormItem>
              <FormLabel>Project name</FormLabel>
              <FormControl>
                <Input {...field} placeholder='My cool resume' autoFocus/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name='description' render={({field}) => (
            <FormItem>
              <FormLabel>Project description</FormLabel>
              <FormControl>
                <Input {...field} placeholder='A brief description of my resume'/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </form>
      </Form>
    </div>
  )
}

export default GeneralInfoForm