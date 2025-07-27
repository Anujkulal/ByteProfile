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

  console.log("Saving resume data for user:", userId);

  try {
    const { id } = values;

    // Transform and validate the data
    const transformedValues = {
      ...values,
      summary: Array.isArray(values.summary)
        ? values.summary.join(' ')
        : values.summary || "",
    };

    const { photo, experiences, educations, projects, ...resumeValues } =
      ResumeSchema.parse(transformedValues);

    const existingResume = id
      ? await prisma.resume.findUnique({ where: { id, userId } })
      : null;

    if (id && !existingResume) {
      throw new Error("Resume not found");
    }

    let newPhotoUrl: string | undefined | null = undefined;

    // Handle photo upload
    if (photo instanceof File) {
      try {
        console.log("Uploading new photo:", photo.name, photo.size);

        // Delete existing photo if it exists
        if (existingResume?.photoUrl) {
          try {
            await del(existingResume.photoUrl);
            console.log("Deleted existing photo");
          } catch (deleteError) {
            console.warn("Failed to delete existing photo:", deleteError);
          }
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024;
        if (photo.size > maxSize) {
          throw new Error("Image size should be less than 5MB");
        }

        // Validate file type
        if (!photo.type.startsWith('image/')) {
          throw new Error("Invalid file type. Please upload an image.");
        }

        // Generate unique filename with timestamp and random string
        const fileExtension = photo.name.split('.').pop() || 'jpg';
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileName = `resume_photos/${userId}/${timestamp}_${randomString}.${fileExtension}`;

        // Upload to Vercel Blob with addRandomSuffix as fallback
        const blob = await put(fileName, photo, {
          access: "public",
          contentType: photo.type,
          addRandomSuffix: true, // This ensures unique filenames
        });

        newPhotoUrl = blob.url;
        console.log("Photo uploaded successfully:", newPhotoUrl);

      } catch (uploadError) {
        console.error("Photo upload failed:", uploadError);

        // Handle specific Vercel Blob errors
        if (uploadError instanceof Error && uploadError.message.includes('blob already exists')) {
          // Retry with a different filename
          try {
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const fileExtension = photo.name.split('.').pop() || 'jpg';
            const retryFileName = `resume_photos/${userId}/retry_${timestamp}_${randomString}.${fileExtension}`;

            const blob = await put(retryFileName, photo, {
              access: "public",
              contentType: photo.type,
              addRandomSuffix: true,
            });

            newPhotoUrl = blob.url;
            console.log("Photo uploaded successfully on retry:", newPhotoUrl);
          } catch (retryError) {
            throw new Error(`Failed to upload photo after retry: ${retryError instanceof Error ? retryError.message : 'Unknown error'}`);
          }
        } else {
          throw new Error(`Failed to upload photo: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
        }
      }
    } else if (photo === null && existingResume?.photoUrl) {
      // User wants to remove the photo
      try {
        await del(existingResume.photoUrl);
        newPhotoUrl = null;
        console.log("Photo removed successfully");
      } catch (deleteError) {
        console.warn("Failed to delete photo:", deleteError);
        newPhotoUrl = null;
      }
    }

    // Rest of your save logic remains the same...
    const commonData = {
      ...resumeValues,
      ...(newPhotoUrl !== undefined && { photoUrl: newPhotoUrl }),
      updatedAt: new Date(),
    };

    const experienceData = experiences?.map((exp) => ({
      ...exp,
      startDate: exp.startDate ? new Date(exp.startDate) : undefined,
      endDate: exp.endDate ? new Date(exp.endDate) : undefined,
    })) || [];

    const educationData = educations?.map((edu) => ({
      ...edu,
      startDate: edu.startDate ? new Date(edu.startDate) : undefined,
      endDate: edu.endDate ? new Date(edu.endDate) : undefined,
    })) || [];

    const projectData = projects?.map((proj) => ({
      ...proj,
      startDate: proj.startDate ? new Date(proj.startDate) : undefined,
      endDate: proj.endDate ? new Date(proj.endDate) : undefined,
    })) || [];

    if (id && existingResume) {
      const updatedResume = await prisma.resume.update({
        where: { id },
        data: {
          ...commonData,
          experiences: {
            deleteMany: {},
            create: experienceData,
          },
          educations: {
            deleteMany: {},
            create: educationData,
          },
          projects: {
            deleteMany: {},
            create: projectData,
          },
        },
      });

      console.log("Resume updated successfully:", updatedResume.id);
      return updatedResume;
    } else {
      const newResume = await prisma.resume.create({
        data: {
          ...commonData,
          userId,
          experiences: {
            create: experienceData,
          },
          educations: {
            create: educationData,
          },
          projects: {
            create: projectData,
          },
        },
      });

      console.log("Resume created successfully:", newResume.id);
      return newResume;
    }

  } catch (error) {
    console.error("Error in saveResumeData:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to save resume data. Please try again.");
  }
}
