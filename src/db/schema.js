import {
  pgTable,
  varchar,
  text,
  smallint,
  integer,
  json,
  uniqueIndex,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

// USERS TABLE
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 128 }).notNull().unique(),
  image: text("image").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// WORKSPACE TABLE
export const workspaces = pgTable(
  "workspaces",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 128 }).notNull(),
    slug: varchar("slug", { length: 128 }).notNull().unique(),
    description: text("description"),
    imageUrl: text("image_url").default(""),
    settings: json("settings").default({}),
    ownerId: integer("owner_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    ownerIdx: index("workspace_owner_id_idx").on(t.ownerId),
  })
);

// PROJECTS TABLE
export const projects = pgTable("projects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description"),
  priority: smallint("priority").default(0),
  status: smallint("status").default(0),
  startTime: timestamp("start_time", { withTimezone: true }),
  endTime: timestamp("end_time", { withTimezone: true }),
  progress: integer("progress").default(0),
  teamLead: integer("team_lead")
    .notNull()
    .references(() => users.id, {
      onDelete: "set null",
    }),
  workspaceId: integer("workspace_id")
    .notNull()
    .references(() => workspaces.id, {
      onDelete: "cascade",
    }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// TASKS TABLE
export const tasks = pgTable("tasks", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description"),
  status: smallint("status").default(0),
  type: smallint("type").default(0),
  priority: smallint("priority").default(0),
  assigneeId: integer("assignee_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "set null",
    }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
    }),
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// COMMENT TABLE
export const comments = pgTable("comments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id, {
      onDelete: "cascade",
    }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Junction Tables

// 1. Workspace Member
export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    workspaceId: integer("workspace_id")
      .notNull()
      .references(() => workspaces.id, {
        onDelete: "cascade",
      }),
    role: smallint("role").default(0),
  },
  (t) => ({
    uniqueMembers: uniqueIndex("ws_member_unique").on(t.userId, t.workspaceId),
  })
);

// 2. Project Member
export const projectMembers = pgTable(
  "project_members",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
  },
  (t) => ({
    uniqueMembers: uniqueIndex("project_member_unique").on(t.userId, t.projectId),
  })
);
