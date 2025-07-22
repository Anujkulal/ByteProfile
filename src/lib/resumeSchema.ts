import * as z from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const resumeSchema = z.object({
    title: optionalString,
    description: optionalString,
});

export type Resume = z.infer<typeof resumeSchema>;