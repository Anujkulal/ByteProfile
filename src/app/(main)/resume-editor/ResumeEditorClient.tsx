"use client";

import { Button } from "@/components/ui/button";
import {
  CircleX,
  FileUserIcon,
  MoveLeft,
  MoveRight,
  PenLineIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import ResumeInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import ResumeBreadCrumbs from "../_components/ResumeBreadCrumbs";
import { ResumeValues } from "@/lib/resumeSchema";
import ResumePreviewSection from "./ResumePreviewSection";
import ColorPicker from "@/components/home/ColorPicker";
import BorderStyleButton from "@/components/home/BorderStyle";
import { cn } from "@/lib/utils";
import useUnloadWarning from "@/hooks/useUnloadWarning";

const ResumeEditorClient = () => {
  const searchParams = useSearchParams();
  const [resumeData, setResumeData] = useState<ResumeValues>({});
  const [showSmallScreenPreview, setShowSmallScreenPreview] = useState(false);

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

  // useUnloadWarning()

  return (
    <div className="flex grow flex-col">
      <div className="flex items-center justify-center gap-10 p-3">
        <Button variant={"destructive"} className="rounded-full" asChild>
          <Link href={"/resumes"}>
            {" "}
            <CircleX />{" "}
          </Link>
        </Button>
        <ResumeBreadCrumbs currentStep={currentStep} setCurrentStep={setStep} />
        <div className="flex items-center gap-2">
          <ColorPicker
            color={resumeData.colorHex}
            onChange={(color) =>
              setResumeData({ ...resumeData, colorHex: color.hex })
            }
          />
          <BorderStyleButton
            borderStyle={resumeData.borderStyle}
            onChange={(borderStyle) =>
              setResumeData({ ...resumeData, borderStyle })
            }
          />
          <Button
            variant={"outline"}
            onClick={() => setShowSmallScreenPreview(!showSmallScreenPreview)}
            className="rounded-full md:hidden"
            title={
              showSmallScreenPreview
                ? "Hide Preview"
                : "Show Preview"
            }
          >
            {showSmallScreenPreview ? <PenLineIcon /> : <FileUserIcon />}
          </Button>
        </div>
        <span className="text-muted-foreground opacity-0">Saving...</span>
      </div>

      <div className="flex flex-col h-screen">
        <div className="md:flex">
          <div className="w-full space-y-6 overflow-y-auto p-2 md:w-1/2">
            <div className={cn("rounded-2xl p-2 shadow-sm md:block", showSmallScreenPreview && "hidden")}>
              {FormComponent && (
                <FormComponent
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                />
              )}
              <div className="m-3 flex items-center justify-between gap-3">
                <Button
                  variant={"secondary"}
                  onClick={
                    previousStep ? () => setStep(previousStep) : undefined
                  }
                  disabled={!previousStep}
                >
                  <MoveLeft />
                </Button>
                <Button
                  onClick={nextStep ? () => setStep(nextStep) : undefined}
                  disabled={!nextStep}
                >
                  <MoveRight />
                </Button>
              </div>
            </div>
          </div>
          {/* <div className="hidden w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent md:block dark:via-slate-600" /> */}
          <ResumePreviewSection
            resumeData={resumeData}
            setResumeData={setResumeData}
            className={cn(showSmallScreenPreview && "flex")}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeEditorClient;
