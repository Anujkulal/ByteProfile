import { Prisma } from "@/generated/prisma";
import { ResumeValues } from "./resumeSchema";

export interface ResumeEditorFormProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
}


export const resumeDataInclude = {
  experiences: true,
  educations: true,
  projects: true,
} satisfies Prisma.ResumeInclude;

export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeDataInclude;
}>;