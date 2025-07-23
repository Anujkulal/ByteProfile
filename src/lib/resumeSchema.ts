import * as z from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

/**
 * @description Schema for general information about the resume
 * This includes title and description which will not appear on the resume
 */
export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type generalInfoValues = z.infer<typeof generalInfoSchema>;

/**
 * @description Schema for personal information of the resume
 * This includes fields like firstName, lastName, jobTitle, city, country, phone, email, and photo
 * The photo field is a custom type that allows for file uploads and validates the file type and size
 * It checks if the file is an instance of File and if it is an image type
 * It also checks if the file size is less than 4MB
 * The other fields are optional strings that can be empty or undefined
 * The optionalString is a utility type that allows for empty strings or undefined values
 */
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
 * @description Schema for experience section of the resume
 * This includes fields like position, organization, startDate, endDate, and description
 * All fields are optional strings that can be empty or undefined
 */
export const ExperienceSchema = z.object({
  experiences: z
    .array(
      z.object({
        position: optionalString,
        organization: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      }),
    )
    .optional(),
});

export type ExperienceValues = z.infer<typeof ExperienceSchema>;

/**
 * @description Schema for education section of the resume
 * This includes fields like institution, degree, fieldOfStudy, startDate, and endDate
 * All fields are optional strings that can be empty or undefined
 */
export const EducationSchema = z.object({
  educations: z.array(
    z.object({
      institution: optionalString,
      degree: optionalString,
      fieldOfStudy: optionalString,
      startDate: optionalString,
      endDate: optionalString,
    })
  ).optional(),
})

export type EducationValues = z.infer<typeof EducationSchema>;

/**
 * @description Schema for skills section of the resume
 * This includes an array of skills, where each skill is a string
 * The skills are trimmed to remove any leading or trailing whitespace
 * This schema allows for an empty array of skills, meaning no skills can be provided
 */
export const SkillsSchema = z.object({
  skills: z.array(
    z.string().trim(),
  ).optional()
})

export type SkillsValues = z.infer<typeof SkillsSchema>;

/**
 * @description Schema for summary section of the resume
 * This includes a summary field which is an optional string
 * The summary can be empty or undefined
 */
export const SummarySchema = z.object({
  summary: optionalString,
})

export type SummaryValues = z.infer<typeof SummarySchema>;

/**
 * @module ResumeSchema
 * @description Combined schema for the resume from the above schemas
 * This is the schema that will be used to validate the entire resume form
 */
export const ResumeSchema = z.object({
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...ExperienceSchema.shape,
  ...EducationSchema.shape,
  ...SkillsSchema.shape,
  ...SummarySchema.shape,
});

export type ResumeValues = Omit<z.infer<typeof ResumeSchema>, "photo"> & {
  id?: string; // Optional ID for the resume, useful for updates
  photo?: File | string | null; // Optional file for the photo, to handle file uploads
};
