import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import React from 'react'
import { steps } from '../resume-editor/steps';
import { Button } from '@/components/ui/button';

interface ResumeBreadCrumbsProps {
    currentStep: string;
    setCurrentStep: (step: string) => void;
}

const ResumeBreadCrumbs = ({currentStep, setCurrentStep}: ResumeBreadCrumbsProps) => {
  return (
    <div className='flex justify-center'>
        <Breadcrumb>
            <BreadcrumbList>
                {steps.map((step) => (
                    <React.Fragment key={step.key}>
                        <BreadcrumbItem>
                            {
                                step.key === currentStep ? (
                                    <BreadcrumbPage> {step.title} </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <button onClick={() => setCurrentStep(step.key)}>
                                            {step.title}
                                        </button>
                                    </BreadcrumbLink>
                                )
                            }
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className='last:hidden'/>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    </div>
  )
}

export default ResumeBreadCrumbs