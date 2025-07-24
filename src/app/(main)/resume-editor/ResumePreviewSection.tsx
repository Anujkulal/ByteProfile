import ColorPicker from "@/components/home/ColorPicker";
import ResumePreviewer from "@/components/home/ResumePreviewer";
import { ResumeValues } from "@/lib/resumeSchema";
import { cn } from "@/lib/utils";
import React from "react";

interface ResumePreviewSectionProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
  className?: string;
}

const ResumePreviewSection = ({
  resumeData,
  setResumeData,
  className,
}: ResumePreviewSectionProps) => {
  return (
    <div className={cn(
      "hidden w-full md:flex md:w-1/2", 
      "flex-col overflow-hidden",
      className
    )}>
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-900/50">
        <div className="flex h-full w-full items-start justify-center">
          <ResumePreviewer 
            resumeData={resumeData} 
            className="w-full max-w-[600px] shadow-lg border border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewSection;
