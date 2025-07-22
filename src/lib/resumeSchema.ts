import * as z from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type generalInfoValues = z.infer<typeof generalInfoSchema>;

export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Invalid file type. Please upload an image.",
    ) // returns the message if the cndition is not met or false
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File size must be less than 4MB",
    ),

  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
});

export type personalInfoValues = z.infer<typeof personalInfoSchema>;


/**
 * @description Combined schema for the resume from the above schemas
 * This is the schema that will be used to validate the entire resume form
 */

export const ResumeSchema = z.object({
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
})

export type ResumeValues = Omit<z.infer<typeof ResumeSchema>, "photo"> & {
  id?: string; // Optional ID for the resume, useful for updates
  photo?: File | string | null; // Optional file for the photo, to handle file uploads
}