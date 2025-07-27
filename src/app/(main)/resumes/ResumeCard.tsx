"use client"

import ResumePreviewer1 from '@/components/home/ResumePreviewer1';
import { formatDate } from 'date-fns';
import Link from 'next/link';
import React, { useRef, useState, useTransition } from 'react'
import { useReactToPrint } from 'react-to-print';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { MoreVertical, Printer, Trash2, Clock, Edit, Eye } from 'lucide-react';
import { mapToResumeValues } from '@/lib/utils';
import { ResumeServerData } from '@/lib/types';
import { deleteResume } from './actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ResumeItemProps {
  resume: ResumeServerData;
}

const ResumeCard = ({ resume }: ResumeItemProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resume.title || "Resume",
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    `
  });

  const wasUpdated = resume.updatedAt !== resume.createdAt;

  return (
    <div 
      className={cn(
        "group relative rounded-xl border bg-card text-card-foreground transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        "border-border/50 hover:border-border shadow-sm"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Section */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <Link
              href={`/resume-editor?resumeId=${resume.id}`}
              className="block group-hover:text-primary transition-colors"
            >
              <h3 className="font-semibold truncate text-base">
                {resume.title || "Untitled Resume"}
              </h3>
            </Link>
            {resume.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {resume.description}
              </p>
            )}
          </div>
          <MoreMenu resumeId={resume.id} onPrintClick={reactToPrintFn} />
        </div>

        {/* Status and Date */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>
            {wasUpdated ? "Updated" : "Created"} {formatDate(resume.updatedAt, "MMM d, yyyy")}
          </span>
        </div>
      </div>

      {/* Preview Section */}
      <div className="px-4 pb-4">
        <Link
          href={`/resume-editor?resumeId=${resume.id}`}
          className="block relative group"
        >
          <div className="relative overflow-hidden rounded-lg border border-border/30 bg-white">
            <ResumePreviewer1
              resumeData={mapToResumeValues(resume)}
              contentRef={contentRef}
              className="transition-transform duration-300 group-hover:scale-[1.02]"
              enableClickableLinks={false}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Hover Actions */}
            <div className={cn(
              "absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-all duration-300",
              "group-hover:opacity-100"
            )}>
              <Button
                size="sm"
                variant="secondary"
                className="shadow-lg bg-white/90 hover:bg-white border-0"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="shadow-lg bg-white/90 hover:bg-white border-0"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>
        </Link>
      </div>

      {/* Bottom Section with Stats */}
      <div className="px-4 pb-3 pt-1 border-t border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Updated {formatDate(resume.updatedAt, "h:mm a")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={cn(
              "h-2 w-2 rounded-full",
              wasUpdated ? "bg-green-500" : "bg-blue-500"
            )} />
            <span className="text-xs text-muted-foreground">
              {wasUpdated ? "Modified" : "New"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeCard

interface MoreMenuProps {
  resumeId: string;
  onPrintClick: () => void;
}

function MoreMenu({ resumeId, onPrintClick }: MoreMenuProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              "hover:bg-muted/80"
            )}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={onPrintClick}
          >
            <Printer className="h-4 w-4" />
            Print Resume
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete Resume
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmationDialog
        resumeId={resumeId}
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      />
    </>
  );
}

interface DeleteConfirmationDialogProps {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteConfirmationDialog({
  resumeId,
  open,
  onOpenChange,
}: DeleteConfirmationDialogProps) {
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteResume(resumeId);
        onOpenChange(false);
        toast.success("Resume deleted successfully");
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong. Please try again");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Resume
          </DialogTitle>
          <DialogDescription className="text-base">
            Are you sure you want to delete this resume? This action cannot be undone and will permanently remove all associated data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}