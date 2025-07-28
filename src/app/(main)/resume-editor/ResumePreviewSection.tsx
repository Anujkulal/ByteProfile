import ColorPicker from "@/components/home/ColorPicker";
import { ResumeValues } from "@/lib/resumeSchema";
import { cn } from "@/lib/utils";
import React from "react";
import { templates } from "./templates";

interface ResumePreviewSectionProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
  selectedTemplate: string;
  className?: string;
  printRef?: React.RefObject<HTMLDivElement | null>; // Optional ref for printing
}

const ResumePreviewSection = ({
  resumeData,
  setResumeData,
  selectedTemplate,
  className,
  printRef,
}: ResumePreviewSectionProps) => {
  const selectedTemplateObj = templates.find(
    (template) => template.key === selectedTemplate,
  );
  const TemplateComponent =
    selectedTemplateObj?.component || templates[0].component; // Fallback to first template

return (
    <div
      className={cn(
        "hidden w-full md:flex md:w-1/2",
        "flex-col",
        className,
      )}
    >
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex h-full w-full items-start justify-center" >
          {/* <ResumePreviewer2
            resumeData={resumeData} 
            className={cn("w-full max-w-[600px] shadow-lg rounded-2xl border-8 border-slate-900 dark:border-slate-700")}
          /> */}
          {/* <div className="print:shadow-none print:border-none" ref={printRef}> */}
            <TemplateComponent
              resumeData={resumeData}
              className={cn(
                "w-full max-w-[600px] rounded-2xl overflow-y-auto border-8 border-slate-900 shadow-lg dark:border-slate-700 print:border-none print:shadow-none",
              )}
              printRef={printRef} // Pass the ref to template component
            />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewSection;
