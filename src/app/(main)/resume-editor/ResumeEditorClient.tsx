"use client";

import { Button } from "@/components/ui/button";
import { CircleX, MoveLeft, MoveRight } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import ResumeInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import ResumeBreadCrumbs from "../_components/ResumeBreadCrumbs";
import { ResumeValues } from "@/lib/resumeSchema";
import ResumePreviewSection from "./ResumePreviewSection";

const ResumeEditorClient = () => {
  const searchParams = useSearchParams();
  const [resumeData, setResumeData] = useState<ResumeValues>({});

  const currentStep = searchParams.get("step") || steps[0].key;

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.component;

  // Footer logic
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key; // This finds the previous step based on the current step
  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key; // This finds the next step based on the current step

  return (
    <div className="flex grow flex-col">
      
      <div className="flex items-center gap-3 p-3">
            <Button variant={"destructive"} className="rounded-full"  asChild>
              <Link href={"/resumes"}> <CircleX /> </Link>
            </Button>
            <span className="text-muted-foreground opacity-0">Saving...</span>
          </div>
      <div className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="w-full space-y-6 overflow-y-auto p-2 md:w-1/2">
            <ResumeBreadCrumbs
              currentStep={currentStep}
              setCurrentStep={setStep}
            />
            <div className="shadow-sm rounded-2xl p-2">
            {FormComponent && <FormComponent resumeData={resumeData} setResumeData={setResumeData} />}
              <div className="flex items-center gap-3 m-3">
            <Button variant={"secondary"} onClick={previousStep ? () => setStep(previousStep): undefined} disabled={!previousStep}>
              <MoveLeft />
            </Button>
            <Button onClick={nextStep ? () => setStep(nextStep) : undefined} disabled={!nextStep}>
              <MoveRight />
            </Button>
          </div>
            </div>
          </div>
          <div className="hidden w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent dark:via-slate-600 md:block" />
          <ResumePreviewSection resumeData={resumeData} setResumeData={setResumeData} />
        </div>
      </div>
      
    </div>
  );
};

export default ResumeEditorClient;
