import { relations } from "drizzle-orm";
import {
  users,
  workspaces,
  workspaceMembers,
  projects,
  projectMembers,
  tasks,
  comments,
} from "./schema";

// 1. User Relations
export const userRelations = relations(users, ({ many }) => ({
  ownedWorkspaces: many(workspaces),
  workspaceMemberships: many(workspaceMembers),
  ownedProjects: many(projects),
  projectMemberships: many(projectMembers),
  assignedTasks: many(tasks),
  comments: many(comments),
}));

// 2. Workspace Relations
export const workspaceRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  projects: many(projects),
  members: many(workspaceMembers),
}));

// 3. Project Relations
export const projectRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
  owner: one(users, {
    fields: [projects.teamLead],
    references: [users.id],
  }),
  members: many(projectMembers),
}));

// 4. Task Relations
export const taskRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
  comments: many(comments),
}));

// 5. Comment Relations
export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
}));

// 6. Workspace Members Relations
export const workspaceMembersRelations = relations(
  workspaceMembers,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMembers.workspaceId],
      references: [workspaces.id],
    }),
    member: one(users, {
      fields: [workspaceMembers.userId],
      references: [users.id],
    }),
  }),
);

// 7. Project Members Relations
export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  member: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));
