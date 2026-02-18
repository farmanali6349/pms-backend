import z from "zod";

// USER SCHEMA
export const userSchema = z.object({
  id: z.coerce.number().positive().optional(),
  name: z
    .string()
    .nonempty()
    .min(1, "Name is required")
    .max(128, "You cannot exceed the 128 characters."),
  email: z
    .email("Please enter a valid email")
    .min(1, "Email is required")
    .max(128, "You cannot exceed 128 characters in the email"),
  externalId: z.string().max(128, "External ID can't have more than 128 characters").optional(),
  image: z.string().default(""),
});

// WORKSPACE SCHEMA
export const workspaceSchema = z.object({
  id: z.coerce.number().positive().optional(),
  name: z
    .string()
    .min(4, "Min 04 letters are required")
    .max(128, "You cannot exceed the 128 characters."),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().optional(),
  imageUrl: z.string().default(""),
  settings: z.json().default({}),
  ownerId: z.coerce.number().positive(),
});

// PROJECT SCHEMA
export const projectSchema = z.object({
  id: z.coerce.number().positive().optional(),
  title: z.string().nonempty().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.coerce.number().min(0).max(32767).default(0),
  status: z.coerce.number().min(0).max(32767).default(0),
  startTime: z.iso.datetime().optional(),
  endTime: z.iso.datetime().optional(),
  progress: z.coerce.number().min(0).max(100).default(0),
  teamLead: z.coerce.number().positive(),
  workspaceId: z.coerce.number().positive(),
});

// TASK SCHEMA
export const taskSchema = z.object({
  title: z.string().nonempty().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.coerce.number().min(0).max(32767).default(0),
  type: z.coerce.number().min(0).max(32767).default(0),
  priority: z.coerce.number().min(0).max(32767).default(0),
  assigneeId: z.coerce.number().positive(),
  projectId: z.coerce.number().positive(),
  dueDate: z.iso.datetime().optional(),
});

// COMMENT SCHEMA
export const commentSchema = z.object({
  content: z.string(),
  userId: z.coerce.number().positive(),
  taskId: z.coerce.number().positive(),
});

// UPDATE SCHEMAS FOR EACH
export const userUpdateSchema = userSchema.omit({ externalId: true }).partial();

export const workspaceUpdateSchema = workspaceSchema.omit({ id: true }).partial();

export const projectUpdateSchema = projectSchema.omit({ id: true }).partial();

export const taskUpdateSchema = taskSchema.omit({ id: true }).partial();

export const commentUpdateSchema = commentSchema.omit({ id: true }).partial();
