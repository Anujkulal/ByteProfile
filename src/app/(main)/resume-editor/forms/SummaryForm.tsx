import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { SummarySchema, SummaryValues } from '@/lib/resumeSchema';
import { ResumeEditorFormProps } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';

const SummaryForm = ({resumeData, setResumeData}: ResumeEditorFormProps) => {
    const form = useForm<SummaryValues>({
        resolver: zodResolver(SummarySchema),
        defaultValues: {
          summary: resumeData.summary || "",
        },
      });

      useEffect(() => {
          const subscription = form.watch((values) => {
            setResumeData({
              ...resumeData,
              ...values,
            //   summary: values.summary || "",
            });
          });
          return () => subscription.unsubscribe();
        }, [form.watch, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
       <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Summary</h2>
        <p className="text-muted-foreground text-sm">Write a brief summary of your professional background and skills or generate using AI.</p>
      </div> 
      <Form {...form}>
              <form className="space-y-3">
                <FormField
                  control={form.control}
                  name={`summary`}
                  render={({ field }) => (
                    <FormItem>
                     <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="I am a software engineer with expertise in JavaScript, TypeScript, React.js, and Next.js. I have a strong background in building scalable web applications and a passion for learning new technologies..."
                          onChange={(e) => {
                              const skills = e.target.value.split(",");
                              field.onChange(skills);
                          }}
                          autoFocus
                        />
                      </FormControl>
                      <FormDescription>Write a brief summary of your professional background and skills.</FormDescription>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
    </div>
  )
}

export default SummaryForm