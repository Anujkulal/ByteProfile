import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ExperienceSchema, ExperienceValues } from '@/lib/resumeSchema'
import { ResumeEditorFormProps } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { GripHorizontal, PlusCircle, Trash2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form'

const ExperienceForm = ({ resumeData, setResumeData }: ResumeEditorFormProps) => {
    const form = useForm<ExperienceValues>({
        resolver: zodResolver(ExperienceSchema),
        defaultValues: {
            experiences: resumeData.experiences || [],
        }
    })

     useEffect(() => {
        const subscription = form.watch((values) => {
          setResumeData({ ...resumeData, experiences: values.experiences?.filter(exp => exp != undefined) || [] });
        });
        return () => subscription.unsubscribe();
      }, [form.watch, setResumeData]);

      // allows to dynamically add and remove experiences
      const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'experiences',
      })

  return (
    <div className='max-w-xl mx-auto space-y-6'>
        <div className="space-y-1.5 text-center">
            <h2 className="text-2xl font-semibold">Experience</h2>
            <p className="text-sm text-muted-foreground">Add your work experience</p>
        </div>
        <Form {...form}>
            <form className='space-y-3'>
                {
                    fields.map((field, index) => (
                        <ExperienceItem key={field.id} index={index} form={form} remove={remove} />
                    ))
                }
                <div className="flex justify-center">
                    <Button type='button' onClick={() => append({
                        position: '',
                        organization: '',
                        startDate: '',
                        endDate: '',
                        description: ''
                    })}> <PlusCircle /> Add experience</Button>
                </div>
            </form>

        </Form>
    </div>
  )
}

interface ExperienceItemProps {
    form: UseFormReturn<ExperienceValues>;
    index: number;
    remove: (index: number) => void;
}

function ExperienceItem({ form, index, remove }: ExperienceItemProps) {
    return <div className='space-y-3 border rounded-md bg-background p-3'>
         <div className="flex justify-between gap-2">
            <span className="font-semibold">Experience {index+1}</span>
            <div className="flex gap-6 items-center">
                <Button variant={"destructive"} type='button' onClick={() => remove(index)}> < Trash2 /> </Button>
                <GripHorizontal className='text-muted-foreground cursor-grab' />

            </div>
         </div>
         <FormField 
         control={form.control} 
         name={`experiences.${index}.position`}
         render={({field}) => (
            <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                    <Input {...field} autoFocus />
                </FormControl>
            </FormItem>
         )}
         />
         <FormField 
         control={form.control} 
         name={`experiences.${index}.organization`}
         render={({field}) => (
            <FormItem>
                <FormLabel>Organization</FormLabel>
                <FormControl>
                    <Input {...field} />
                </FormControl>
            </FormItem>
         )}
         />
         <div className="grid grid-cols-2">
            <FormField 
            control={form.control} 
            name={`experiences.${index}.startDate`}
            render={({field}) => (
                <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                    {/* slice to get YYYY-MM-DD format (10 chars) and remove time */}
                        <Input {...field} type='date' value={field.value?.slice(0, 10)} /> 
                    </FormControl>
                </FormItem>
            )}
            />
            <FormField 
            control={form.control} 
            name={`experiences.${index}.endDate`}
            render={({field}) => (
                <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                    {/* slice to get YYYY-MM-DD format (10 chars) and remove time */}
                        <Input {...field} type='date' value={field.value?.slice(0, 10)} /> 
                    </FormControl>
                </FormItem>
            )}
            />

         </div>
         <FormDescription> Leave <span className="font-semibold">End Date</span> empty if you are currently work here</FormDescription>
            <FormField 
            control={form.control} 
            name={`experiences.${index}.description`}
            render={({field}) => (
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                    {/* slice to get YYYY-MM-DD format (10 chars) and remove time */}
                        <Textarea {...field}  /> 
                    </FormControl>
                </FormItem>
            )}
            />

            
         </div>
}

export default ExperienceForm