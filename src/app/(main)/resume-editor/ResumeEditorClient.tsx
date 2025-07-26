"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  CircleX,
  FileUserIcon,
  Loader,
  PenLineIcon,
  Printer,
} from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import ResumeBreadCrumbs from "../_components/ResumeBreadCrumbs";
import { ResumeValues } from "@/lib/resumeSchema";
import ResumePreviewSection from "./ResumePreviewSection";
import ColorPicker from "@/components/home/ColorPicker";
import BorderStyleButton from "@/components/home/BorderStyle";
import { cn } from "@/lib/utils";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import useAutoSave from "@/hooks/useAutoSave";
import ResumeTemplates from "./ResumeTemplates";
import { templates } from "./templates";
import { useReactToPrint } from "react-to-print";

const ResumeEditorClient = () => {
  const searchParams = useSearchParams();
  const [resumeData, setResumeData] = useState<ResumeValues>({});
  const [showSmallScreenPreview, setShowSmallScreenPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].key);

  const { isSaving, hasUnsavedChanges } = useAutoSave(resumeData);
  useUnloadWarning(hasUnsavedChanges);

  const currentStep = searchParams.get("step") || steps[0].key;

  // Create ref for the printable content
  const printRef = useRef<HTMLDivElement>(null);

  // Configure react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: resumeData.title || `${resumeData.firstName || 'Resume'}_${resumeData.lastName || ''}`.trim(),
    pageStyle: `
      @page {
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          

        }
        .no-print {
          display: none !important;
        }
      }
    `,
    onBeforePrint: () => {
      // Optional: You can show a loading state here
      console.log('Preparing to print...');
      return Promise.resolve();
    },
    onAfterPrint: () => {
      // Optional: Handle after print actions
      console.log('Print completed');
    },
  });

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.component;

  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key;
  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key;

  return (
    <div className="flex grow flex-col">
      <div className="flex items-center justify-center gap-10 p-3">
        <Button variant={"destructive"} className="rounded-full hidden sm:block" asChild>
          <Link href={"/resumes"}>
            <CircleX />
          </Link>
        </Button>
        <ResumeBreadCrumbs currentStep={currentStep} setCurrentStep={setStep} />
        <div className="flex items-center gap-2">
          <ColorPicker
            color={resumeData.colorHex}
            onChange={(color) =>
              setResumeData(prev => ({ ...prev, colorHex: color.hex }))
            }
          />
          <BorderStyleButton
            borderStyle={resumeData.borderStyle}
            onChange={(borderStyle) =>
              setResumeData({ ...resumeData, borderStyle })
            }
          />
          <ResumeTemplates 
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
          />
          <Button
            variant={"outline"}
            onClick={() => setShowSmallScreenPreview(!showSmallScreenPreview)}
            className="rounded-full md:hidden"
            title={showSmallScreenPreview ? "Hide Preview" : "Show Preview"}
          >
            {showSmallScreenPreview ? <PenLineIcon /> : <FileUserIcon />}
          </Button>
          <Button
            variant="default"
            onClick={handlePrint}
            className="flex items-center gap-2"
            disabled={!resumeData.firstName} // Disable if no basic info
          >
            <Printer size={16} />
          </Button>
        <span className={cn("text-muted-foreground opacity-0", isSaving && "opacity-100")}>
          {/* Saving... */} <Loader className={cn("", isSaving && "animate-spin")} />
        </span>
        </div>
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
              <div className="m-3 mt-6 flex items-center justify-center gap-3">
                <Button
                  variant={"secondary"}
                  onClick={previousStep ? () => setStep(previousStep) : undefined}
                  disabled={!previousStep}
                >
                  <ArrowLeftCircle />
                  Back
                </Button>
                <Button
                  onClick={nextStep ? () => setStep(nextStep) : undefined}
                  disabled={!nextStep}
                >
                  Next
                  <ArrowRightCircle />
                </Button>
              </div>
            </div>
          </div>
          
          <ResumePreviewSection
            resumeData={resumeData}
            setResumeData={setResumeData}
            selectedTemplate={selectedTemplate}
            className={cn(showSmallScreenPreview && "flex")}
            printRef={printRef} // Pass the ref to preview section
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeEditorClient;