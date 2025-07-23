import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { HobbiesSchema, HobbiesValues } from "@/lib/resumeSchema";
import { ResumeEditorFormProps } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const HobbiesForm = ({ resumeData, setResumeData }: ResumeEditorFormProps) => {
  const form = useForm<HobbiesValues>({
    resolver: zodResolver(HobbiesSchema),
    defaultValues: {
      hobbies: resumeData.hobbies || [],
    },
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setResumeData({
        ...resumeData,
        hobbies:
          values.hobbies
            ?.filter((hobby) => hobby != undefined)
            .map((hobby) => hobby.trim())
            .filter((hobby) => hobby !== "") || [],
      });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
          <div className="space-y-1.5 text-center">
            <h2 className="text-2xl font-semibold">Hobbies Info</h2>
            <p className="text-muted-foreground text-sm">Mention your hobbies</p>
          </div>
          <Form {...form}>
            <form className="space-y-3">
              <FormField
                control={form.control}
                name={`hobbies`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hobbies</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="..."
                        onChange={(e) => {
                            const hobbies = e.target.value.split(",");
                            field.onChange(hobbies);
                        }}
                        autoFocus
                      />
                    </FormControl>
                    <FormDescription>List your hobbies separated by commas</FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
  )
};

export default HobbiesForm;
