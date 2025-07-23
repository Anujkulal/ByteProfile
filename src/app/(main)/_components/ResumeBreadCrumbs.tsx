import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { steps } from "../resume-editor/steps";
import { Button } from "@/components/ui/button";
import { DeleteIcon } from "lucide-react";

interface ResumeBreadCrumbsProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
}

const ResumeBreadCrumbs = ({
  currentStep,
  setCurrentStep,
}: ResumeBreadCrumbsProps) => {
  return (
    <div className="flex justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.key}>
                <BreadcrumbItem>
                  {step.key === currentStep ? (
                    <BreadcrumbPage className="cursor-pointer">  {Icon && <Icon size={20} />} </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink className="cursor-pointer" asChild>
                      <button onClick={() => setCurrentStep(step.key)}>
                         {Icon && <Icon size={16} />}
                        {/* {step.title} */}
                      </button>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator className="last:hidden" />
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default ResumeBreadCrumbs;
