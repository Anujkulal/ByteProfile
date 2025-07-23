import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { AchievementsSchema, AchievementsValues } from '@/lib/resumeSchema';
import { ResumeEditorFormProps } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';

const AchievementsForm = ({resumeData, setResumeData}: ResumeEditorFormProps) => {
  const form = useForm<AchievementsValues>({
      resolver: zodResolver(AchievementsSchema),
      defaultValues: {
        achievements: resumeData.achievements || [],
      },
    });
  
    useEffect(() => {
      const subscription = form.watch((values) => {
        setResumeData({
          ...resumeData,
          achievements:
            values.achievements
              ?.filter((achievement) => achievement != undefined)
              .map((achievement) => achievement.trim())
              .filter((achievement) => achievement !== "") || [],
        });
      });
      return () => subscription.unsubscribe();
    }, [form.watch, setResumeData]);
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Achievements Info</h2>
        <p className="text-muted-foreground text-sm">Add your achievements</p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name={`achievements`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Achievements</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="..."
                    onChange={(e) => {
                        const achievements = e.target.value.split(",");
                        field.onChange(achievements);
                    }}
                    autoFocus
                  />
                </FormControl>
                <FormDescription>List your achievements separated by commas</FormDescription>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}

export default AchievementsForm