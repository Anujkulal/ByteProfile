"use client";

import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import ResumeInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import ResumeBreadCrumbs from "../_components/ResumeBreadCrumbs";
import { ResumeValues } from "@/lib/resumeSchema";

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
      <header className="space-y-1.5 border- px-3 py-5 text-center">
        <h1 className="text-lg font-semibold">Resume Editor</h1>
        <p className="text-muted-foreground text-sm">
          Edit your resume details below
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="w-full space-y-6 overflow-y-auto p-2 md:w-1/2">
            <ResumeBreadCrumbs
              currentStep={currentStep}
              setCurrentStep={setStep}
            />
            <div className="shadow-sm rounded-2xl p-2">
            {FormComponent && <FormComponent resumeData={resumeData} setResumeData={setResumeData} />}

            </div>
          </div>
          <div className="hidden w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent dark:via-slate-600 md:block" />
          <div className="hidden w-1/2 md:flex overflow-y-auto shadow-sm rounded-2xl p-2 m-1">
            <pre>
              {JSON.stringify(resumeData, null, 2)}
            </pre>
          </div>
        </div>
      </main>
      <footer className="w-full border-t px-3 py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2">
          <div className="flex items-center gap-3">
            <Button variant={"secondary"} onClick={previousStep ? () => setStep(previousStep): undefined} disabled={!previousStep}>
              <MoveLeft />
            </Button>
            <Button onClick={nextStep ? () => setStep(nextStep) : undefined} disabled={!nextStep}>
              <MoveRight />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant={"secondary"} asChild>
              <Link href={"/resumes"}>Close</Link>
            </Button>
            <span className="text-muted-foreground opacity-0">Saving...</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResumeEditorClient;
