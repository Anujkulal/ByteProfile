import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { SkillsSchema, SkillsValues } from "@/lib/resumeSchema";
import { ResumeEditorFormProps } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const SkillsForm = ({ resumeData, setResumeData }: ResumeEditorFormProps) => {
  const form = useForm<SkillsValues>({
    resolver: zodResolver(SkillsSchema),
    defaultValues: {
      skills: resumeData.skills || [],
    },
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setResumeData({
        ...resumeData,
        skills:
          values.skills
            ?.filter((skill) => skill != undefined)
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "") || [],
      });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills Information</h2>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name={`skills`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="JavaScript, TypeScript, React.js Next.js ..."
                    onChange={(e) => {
                        const skills = e.target.value.split(",");
                        field.onChange(skills);
                    }}
                    autoFocus
                  />
                </FormControl>
                <FormDescription>List your skills separated by commas</FormDescription>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default SkillsForm;
