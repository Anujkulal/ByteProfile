import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { templates } from "./templates";
import { cn } from "@/lib/utils";

interface ResumeTemplatesProps {
  selectedTemplate: string;
  onTemplateChange: (templateKey: string) => void;
}

const ResumeTemplates = ({
  selectedTemplate,
  onTemplateChange,
}: ResumeTemplatesProps) => {
  const [open, setOpen] = useState(false);

  const handleTemplateSelect = (templateKey: string) => {
    onTemplateChange(templateKey);
    setOpen(false); // Close dialog after selection
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <form> */}
        <DialogTrigger asChild>
          <Button variant="outline">Templates</Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col items-center sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose Resume Template</DialogTitle>
            <DialogDescription>
              Select a template for your resume. Click on a template to apply
              it.
            </DialogDescription>
          </DialogHeader>
          <Carousel className="flex w-[80%] max-w-sm justify-center">
            <CarouselContent className="-ml-1">
              {templates.map((template, index) => (
                <CarouselItem key={template.key} className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg",
                      selectedTemplate === template.key && "ring-2 ring-blue-500 ring-offset-2"
                    )}
                    onClick={() => handleTemplateSelect(template.key)}
                  >
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <div className="text-center">
                        <span className="text-2xl font-semibold">{index + 1}</span>
                        <p className="text-xs text-muted-foreground mt-1">{template.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
        {/* </form> */}
      </Dialog>
    </div>
  );
};

export default ResumeTemplates;
