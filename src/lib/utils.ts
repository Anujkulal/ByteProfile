import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ResumeServerData } from "./types";
import { ResumeValues } from "./resumeSchema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  console.log("Mapping ResumeServerData to ResumeValues:", data);
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    linkedInUrl: data.linkedInUrl || undefined,
    githubUrl: data.githubUrl || undefined,
    websiteUrl: data.websiteUrl || undefined,
    experiences: data.experiences?.map((exp) => ({
      position: exp.position || undefined,
      organization: exp.organization || undefined,
      startDate: exp.startDate?.toISOString().split("T")[0],
      endDate: exp.endDate?.toISOString().split("T")[0],
      description: exp.description || undefined,
    })),
    educations: data.educations?.map((edu) => ({
      degree: edu.degree || undefined,
      institution: edu.institution || undefined,
      startDate: edu.startDate?.toISOString().split("T")[0],
      endDate: edu.endDate?.toISOString().split("T")[0],
      fieldOfStudy: edu.fieldOfStudy || undefined, // Add this field
    })),
    projects: data.projects?.map((proj) => ({
      title: proj.title || undefined,
      url: proj.url || undefined,
      startDate: proj.startDate?.toISOString().split("T")[0],
      endDate: proj.endDate?.toISOString().split("T")[0],
      description: proj.description || undefined,
    })),
    
    achievements: data.achievements || undefined,
    
    skills: data.skills,
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    summary: data.summary || undefined,
  };
}