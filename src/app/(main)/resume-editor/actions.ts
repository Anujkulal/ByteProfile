"use server"

import prisma from "@/lib/prisma";
import { ResumeSchema, ResumeValues } from "@/lib/resumeSchema";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import path from "path";

export async function saveResumeData(values: ResumeValues) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { id } = values;

  console.log("Received values: ", values);

  const { photo, experiences, educations, projects, ...resumesValues } =
    ResumeSchema.parse(values);

  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id, userId } })
    : null;

    console.log("Existing resume: ", existingResume);

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }
  let newPhotoUrl: string | undefined | null = undefined;

  if (photo instanceof File) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }

    const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
      access: "public",
    });

    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    newPhotoUrl = null;
  }

  if (id) {
    return prisma.resume.update({
      where: { id },
      data: {
        ...resumesValues,
        photoUrl: newPhotoUrl,
        experiences: {
          deleteMany: {},
          create: experiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          deleteMany: {},
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
        projects: {
          deleteMany: {},
          create: projects?.map((proj) => ({
            ...proj,
            startDate: proj.endDate ? new Date(proj.endDate) : undefined,
            endDate: proj.endDate ? new Date(proj.endDate) : undefined,
          })),
        },
        updatedAt: new Date(),
      },
    });
  }
  else{ //if no id is provided, create a new resume
    return prisma.resume.create({
      data: {
        ...resumesValues,
        userId, // Associate the resume with the user
        photoUrl: newPhotoUrl,
        experiences: {
          create: experiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
          })),
        },
        projects: {
          create: projects?.map((proj) => ({
            ...proj,
            endDate: proj.endDate ? new Date(proj.endDate) : undefined,
          })),
        },
      },
    });
  }
}
