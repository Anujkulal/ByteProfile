import { Button } from "@/components/ui/button";
import {
    Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EducationSchema, EducationValues } from "@/lib/resumeSchema";
import { ResumeEditorFormProps } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal, PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";

const EducationForm = ({
  resumeData,
  setResumeData,
}: ResumeEditorFormProps) => {
  const form = useForm<EducationValues>({
    resolver: zodResolver(EducationSchema),
    defaultValues: {
      educations: resumeData.educations || [],
    },
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setResumeData({
        ...resumeData,
        educations: values.educations?.filter((exp) => exp != undefined) || [],
      });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setResumeData]);

  // allows to dynamically add and remove educations
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educations",
  });
  return <div className='max-w-xl mx-auto space-y-6'>
        <div className="space-y-1.5 text-center">
            <h2 className="text-2xl font-semibold">Education Info</h2>
            <p className="text-sm text-muted-foreground">Add your education details</p>
        </div>
        <Form {...form}>
            <form className='space-y-3'>
                {
                    fields.map((field, index) => (
                        <EducationItem key={field.id} index={index} form={form} remove={remove} />
                    ))
                }
                <div className="flex justify-center">
                    <Button type='button' onClick={() => append({
                        institution: '',
                        degree: '',
                        fieldOfStudy: '',
                        startDate: '',
                        endDate: '',
                    })}> <PlusCircle /> Add education</Button>
                </div>
            </form>

        </Form>
    </div>
};

interface EducationItemProps {
  form: UseFormReturn<EducationValues>;
  index: number;
  remove: (index: number) => void;
}

const EducationItem = ({ form, index, remove }: EducationItemProps) => {
  return (
    <div className="bg-background space-y-3 rounded-md border p-3">
      <div className="flex justify-between gap-2">
        <span className="font-semibold">Education {index + 1}</span>
        <div className="flex items-center gap-6">
          <Button
            variant={"destructive"}
            type="button"
            onClick={() => remove(index)}
          >
            {" "}
            <Trash2 />{" "}
          </Button>
          <GripHorizontal className="text-muted-foreground cursor-grab" />
        </div>
      </div>
      <FormField
        control={form.control}
        name={`educations.${index}.institution`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Institution</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`educations.${index}.degree`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Degree</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`educations.${index}.fieldOfStudy`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Field of Study</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2">
        <FormField
          control={form.control}
          name={`educations.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                {/* slice to get YYYY-MM-DD format (10 chars) and remove time */}
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`educations.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                {/* slice to get YYYY-MM-DD format (10 chars) and remove time */}
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormDescription>
        {" "}
        Leave <span className="font-semibold">End Date</span> empty if you are
        currently enrolled
      </FormDescription>
    </div>
  );
};

export default EducationForm;
