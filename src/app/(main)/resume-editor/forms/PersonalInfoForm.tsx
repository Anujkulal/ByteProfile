import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { personalInfoSchema, personalInfoValues } from "@/lib/resumeSchema";
import { ResumeEditorFormProps } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

const PersonalInfoForm = ({ resumeData, setResumeData }: ResumeEditorFormProps) => {
  const form = useForm<personalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: resumeData.firstName || "",
      lastName: resumeData.lastName || "",
      jobTitle: resumeData.jobTitle || "",
      city: resumeData.city || "",
      country: resumeData.country || "",
      phone: resumeData.phone || "",
      email: resumeData.email || "",
      linkedInUrl: resumeData.linkedInUrl || "",
      githubUrl: resumeData.githubUrl || "",
      websiteUrl: resumeData.websiteUrl || "",
    },
  });

  useEffect(() => {
    // const { unsubscribe } = form.watch(async () => {
    //   const isValid = await form.trigger();
    //   console.log("Form is valid:", isValid);
    //   if (!isValid) return;
    // });
    // return unsubscribe;

    const subscription = form.watch((values) => {
    setResumeData({...resumeData, ...values})
  });

  return () => subscription.unsubscribe();

  }, [form.watch, setResumeData]);
  

  const photoInputUrl = useRef<HTMLInputElement>(null);

  

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Personal Information</h2>
      </div>
      <Form {...form}>
        <form action="" className="space-y-3">
          <FormField
            control={form.control}
            name="photo"
            render={({ field: { value, ...fieldValues } }) => (
              <FormItem>
                <FormLabel>Profile Photo</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      {...fieldValues}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        //File handling
                        const file = e.target.files?.[0]; // select the single file from the **FileList object**, incase the user selects multiple files
                        fieldValues.onChange(file);
                      }}
                      ref={photoInputUrl}
                    />
                  </FormControl>
                      <Button
                      variant={"destructive"} type="button" onClick={() => {
                        fieldValues.onChange(null);
                        if(photoInputUrl.current){
                          photoInputUrl.current.value = ""; // Clear the input value
                        }
                      }}>
                        Cancel
                      </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
            control={form.control}
            name="firstName"
            render={({field}) => (
                <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="John" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="lastName"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Doe" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="jobTitle"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Software Engineer" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="city"
            render={({field}) => (
                <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Udupi" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="country"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="India" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="phone"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                        <Input type="tel" {...field} placeholder="1234567890" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type="email" {...field} placeholder="example@example.com" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="linkedInUrl"
            render={({field}) => (
                <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                        <Input type="url" {...field} placeholder="https://www.linkedin.com/in/username" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="githubUrl"
            render={({field}) => (
                <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                        <Input type="url" {...field} placeholder="https://github.com/username" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="websiteUrl"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                        <Input type="url" {...field} placeholder="https://yourwebsite.com" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PersonalInfoForm;
