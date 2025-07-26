import prisma from "@/lib/prisma";
import { ResumeSchema, ResumeValues } from "@/lib/resumeSchema";
import { auth } from "@clerk/nextjs/server";

export async function saveResumeData(values: ResumeValues){
    const {id} = values;
    console.log("values to save: ", values);

    const {photo, experiences, educations, ...resumesValues} = ResumeSchema.parse(values);   
    const {userId} = await auth();

    if(!userId){
        throw new Error("User not authenticated");
    }

    const existingResume = await id ? await prisma.resume.findUnique({ where: {id: userId} }) : null;

    if(id && !existingResume){
        throw new Error("Resume not found");
    }
    let newPhotoUrl: string | undefined | null = undefined
}