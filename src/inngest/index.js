import { Inngest } from "inngest";
import {
  clerkUserSchema,
  clerkUserDeleteSchema,
  clerkUserUpdateSchema,
} from "../validation/clerk.js";
import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import { userSchema, userUpdateSchema } from "../validation/validation.js";
import { eq } from "drizzle-orm";
// Create a client to send and receive events
export const inngest = new Inngest({ id: "pms" });

const getPrimaryEmail = (clerkUser) => {
  const emails = clerkUser?.email_addresses || [];
  const primary = emails.find((e) => e.primary || e.verified) || emails[0];

  return primary?.email_address?.toLowerCase?.().trim?.() ?? null;
};

const normalizeName = (first, last, full) => {
  const f = (first || "").trim();
  const l = (last || "").trim();

  return [f, l].filter(Boolean).join(" ") || (full || "").trim() || "";
};

const validateCreateClerkPayload = (payload) => {
  const res = clerkUserSchema.safeParse(payload);

  if (!res.success) {
    // Build helpful message with path/issue for logs/tests
    throw new Error("Invalid Clerk Payload: " + res.error.message);
  }

  return res.data;
};
const validateUpdateClerkPayload = (payload) => {
  const res = clerkUserUpdateSchema.safeParse(payload);

  if (!res.success) {
    // Build helpful message with path/issue for logs/tests
    throw new Error("Invalid Clerk Payload For User Update: " + res.error.message);
  }

  return res.data;
};
const validateDeleteClerkPayload = (payload) => {
  const res = clerkUserDeleteSchema.safeParse(payload);

  if (!res.success) {
    throw new Error("Invalid Delete User Payload " + res.error.message);
  }

  return res.data;
};

const upsertUser = async (data) => {
  return await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({
      target: users.externalId,
      set: {
        name: data.name,
        email: data.email,
        image: data.image,
        updatedAt: new Date().toISOString(),
      },
    })
    .returning();
};

// Sync User Creation
export const syncCreateUser = inngest.createFunction(
  { id: "sync-create-clerk-user" },
  { event: "clerk/user.create" },
  async ({ event }) => {
    try {
      // Validate Clerk User Payload
      // Normalize Data for User Creation

      const clerkUserData = validateCreateClerkPayload(event.data);
      const email = getPrimaryEmail(clerkUserData);
      if (!email) {
        throw new Error("Email is not available in clerk user payload");
      }
      const name = normalizeName(
        clerkUserData.first_name,
        clerkUserData.last_name,
        clerkUserData.full_name
      );

      if (!name) {
        throw new Error("Name is not avaialable in clerk user payload");
      }

      const externalId = clerkUserData.id;

      const userData = {
        name,
        email,
        image: clerkUserData.image_url || "",
        externalId,
      };

      const parsedUserData = userSchema.safeParse(userData);
      if (!parsedUserData.success) {
        throw new Error("Invalid user data: " + parsedUserData.error.message);
      }

      const userResult = await upsertUser(parsedUserData.data);
      const user = Array.isArray(userResult) ? userResult[0] : userResult;
      return { success: true, id: user?.id, externalId: user?.externalId, userData: user };
    } catch (error) {
      console.error("syncUpdateUser error, payload id: ", event?.data?.id, error);
      throw error;
    }
  }
);

// Sync User Deletion
export const syncDeleteUser = inngest.createFunction(
  { id: "sync-delete-clerk-user" },
  { event: "clerk/user.delete" },
  async ({ event }) => {
    try {
      // Validate Clerk User Payload
      const clerkUserData = validateDeleteClerkPayload(event.data);

      const externalId = clerkUserData.id;
      if (!externalId) {
        throw new Error("Missing externalId in delete payload");
      }

      // Deleting user
      const queryRes = await db.delete(users).where(eq(users.externalId, externalId)).returning();

      const deleted = Array.isArray(queryRes) ? queryRes.length > 0 : Boolean(queryRes);

      return { success: true, deleted, externalId, rows: queryRes.length ?? (deleted ? 1 : 0) };
    } catch (error) {
      console.error("syncDeleteUser error, payload id: ", event?.data?.id, error);
      throw error;
    }
  }
);

// Sync User Updation
export const syncUpdateUser = inngest.createFunction(
  { id: "sync-update-clerk-user" },
  { event: "clerk/user.update" },
  async ({ event }) => {
    try {
      // Validate Clerk User Payload
      // Normalize Data for User Creation

      const clerkUserData = validateUpdateClerkPayload(event.data);
      const userUpdateData = {};
      const email = getPrimaryEmail(clerkUserData);
      const externalId = clerkUserData.id;

      if (!externalId) {
        throw new Error("Id is not present.");
      }

      if (email) {
        userUpdateData.email = email;
      }

      const name = normalizeName(
        clerkUserData.first_name,
        clerkUserData.last_name,
        clerkUserData.full_name
      );
      if (name) {
        userUpdateData.name = name;
      }

      if (clerkUserData?.image_url) {
        userUpdateData.image = clerkUserData?.image_url;
      }

      userUpdateData.updatedAt = new Date().toISOString();
      const parsedUserData = userUpdateSchema.safeParse(userUpdateData);

      if (!parsedUserData.success) {
        throw new Error("Invalid Payload For User Update: " + parsedUserData.error.message);
      }

      const queryRes = await db
        .update(users)
        .set({ ...parsedUserData })
        .where(eq(users.externalId, externalId))
        .returning();

      const user = Array.isArray(queryRes) ? queryRes[0] : queryRes;
      if (!user) {
        return { success: false, reason: "not_found", externalId };
      }
      return { success: true, id: user?.id, externalId: user?.externalId, userData: user };
    } catch (error) {
      console.error("syncUpdateUser error, payload id: ", event?.data?.id, error);
      throw error;
    }
  }
);
// Create an empty array where we'll export future Inngest functions
export const functions = [syncCreateUser, syncDeleteUser, syncUpdateUser];
