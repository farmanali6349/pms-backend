import z from "zod";
// Clerk User Data Validation

const EmailItem = z.object({
  email_address: z.email().transform((s) => s.toLocaleLowerCase().trim()),
  primary: z.boolean().optional(),
  verified: z.boolean().optional(),
});

export const clerkUserSchema = z.object({
  id: z.union([z.uuid(), z.string()]),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  full_name: z.string().optional(),
  email_addresses: z.array(EmailItem).min(1),
  image_url: z.url().optional().nullable(),
});

export const clerkUserDeleteSchema = z.object({
  id: z.union([z.uuid(), z.string()]),
});

export const clerkUserUpdateSchema = clerkUserSchema
  .extend({ updatedAt: z.iso.datetime().default(() => new Date().toISOString()) })
  .partial()
  .required({ externalId: true });
