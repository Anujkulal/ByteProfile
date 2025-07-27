import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { SummarySchema, SummaryValues } from "@/lib/resumeSchema";
import { ResumeEditorFormProps } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { generateSummary } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader, Sparkle, Sparkles } from "lucide-react";
import { toast } from "sonner";

const SummaryForm = ({ resumeData, setResumeData }: ResumeEditorFormProps) => {
  const [loading, setLoading] = useState(false);

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
          // summary: values.summary || "",
      });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setResumeData]);

  const handleGenerateSummary = async () => {
    try {
      setLoading(true);
      const aiSummary = await generateSummary(resumeData);

      // console.log("Generated Summary:", aiSummary);
      form.setValue("summary", aiSummary);
      toast.success("Summary generated successfully!");

    } catch (error) {
      toast.error("Failed to generate summary. Please try again.");
      console.error("Error generating summary:", error);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Summary</h2>
        <p className="text-muted-foreground text-sm">
          Write a brief summary of your professional background and skills or
          generate using AI.
        </p>
      </div>
      <Form {...form}>
        <Button variant={"generate"} onClick={handleGenerateSummary} disabled={loading || !resumeData}>
          <Sparkles className={loading ? "animate-twinkle" : ""} />{" "}
          {loading ? <Loader className="animate-spin" /> : "generate summary"}{" "}
        </Button>
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
                      field.onChange(e.target.value);
                    }}
                    autoFocus
                  />
                </FormControl>
                <FormDescription>
                  Write a brief summary of your professional background and
                  skills.
                </FormDescription>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default SummaryForm;
