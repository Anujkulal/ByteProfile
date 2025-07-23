import ResumePreviewer from "@/components/home/ResumePreviewer";
import { ResumeValues } from "@/lib/resumeSchema";
import React from "react";

interface ResumePreviewSectionProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
}

const ResumePreviewSection = ({
  resumeData,
  setResumeData,
}: ResumePreviewSectionProps) => {
  return (
    <div className="m-1 hidden w-1/2 rounded-2xl p-2 shadow-sm md:flex">
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        <ResumePreviewer resumeData={resumeData} className="max-w-2xl shadow-md"/>
      </div>
    </div>
  );
};

export default ResumePreviewSection;
