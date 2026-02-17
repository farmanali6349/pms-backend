# Database Design

This document provides a detailed overview of the database schema and the relationships between different tables in the backend.

## Table of Contents

- [Database Design](#database-design)
  - [Table of Contents](#table-of-contents)
  - [Schema Overview](#schema-overview)
  - [Table Details](#table-details)
    - [users](#users)
    - [workspaces](#workspaces)
    - [projects](#projects)
    - [tasks](#tasks)
    - [comments](#comments)
    - [workspaceMembers](#workspacemembers)
    - [projectMembers](#projectmembers)
  - [Relationships](#relationships)
    - [User Relations](#user-relations)
    - [Workspace Relations](#workspace-relations)
    - [Project Relations](#project-relations)
    - [Task Relations](#task-relations)
    - [Comment Relations](#comment-relations)
    - [Workspace Members Relations](#workspace-members-relations)
    - [Project Members Relations](#project-members-relations)

## Schema Overview

The database schema is designed to manage users, workspaces, projects, tasks, and comments, along with the necessary relationships to connect them. Drizzle ORM is used for defining the schema and relations.

## Table Details

### users

Represents individual users of the application.

-   `id`: `INTEGER` (Primary Key, Auto-incrementing)
-   `name`: `VARCHAR(128)` (Not Null)
-   `email`: `VARCHAR(128)` (Not Null, Unique)
-   `image`: `TEXT` (Default: `""`)
-   `createdAt`: `TIMESTAMP with timezone` (Default: Current timestamp)
-   `updatedAt`: `TIMESTAMP with timezone` (Default: Current timestamp)

### workspaces

Represents distinct workspaces, each owned by a user.

-   `id`: `INTEGER` (Primary Key, Auto-incrementing)
-   `name`: `VARCHAR(128)` (Not Null)
-   `slug`: `VARCHAR(128)` (Not Null, Unique)
-   `description`: `TEXT` (Nullable)
-   `imageUrl`: `TEXT` (Default: `""`)
-   `settings`: `JSON` (Default: `{}`)
-   `ownerId`: `INTEGER` (Not Null, Foreign Key to `users.id`, `onDelete: cascade`)
-   `createdAt`: `TIMESTAMP with timezone` (Default: Current timestamp)
-   `updatedAt`: `TIMESTAMP with timezone` (Default: Current timestamp)

### projects

Represents projects within a workspace.

-   `id`: `INTEGER` (Primary Key, Auto-incrementing)
-   `title`: `TEXT` (Not Null)
-   `description`: `TEXT` (Nullable)
-   `priority`: `SMALLINT` (Default: `0`)
-   `status`: `SMALLINT` (Default: `0`)
-   `startTime`: `TIMESTAMP with timezone` (Nullable)
-   `endTime`: `TIMESTAMP with timezone` (Nullable)
-   `progress`: `INTEGER` (Default: `0`)
-   `teamLead`: `INTEGER` (Foreign Key to `users.id`, `onDelete: set null`)
-   `workspaceId`: `INTEGER` (Not Null, Foreign Key to `workspaces.id`, `onDelete: cascade`)
-   `createdAt`: `TIMESTAMP with timezone` (Default: Current timestamp)
-   `updatedAt`: `TIMESTAMP with timezone` (Default: Current timestamp)

### tasks

Represents individual tasks, belonging to a project and assigned to a user.

-   `id`: `INTEGER` (Primary Key, Auto-incrementing)
-   `title`: `TEXT` (Not Null)
-   `description`: `TEXT` (Nullable)
-   `status`: `SMALLINT` (Default: `0`)
-   `type`: `SMALLINT` (Default: `0`)
-   `priority`: `SMALLINT` (Default: `0`)
-   `assigneeId`: `INTEGER` (Foreign Key to `users.id`, `onDelete: set null`)
-   `projectId`: `INTEGER` (Not Null, Foreign Key to `projects.id`, `onDelete: cascade`)
-   `dueDate`: `TIMESTAMP with timezone` (Nullable)
-   `createdAt`: `TIMESTAMP with timezone` (Default: Current timestamp)
-   `updatedAt`: `TIMESTAMP with timezone` (Default: Current timestamp)

### comments

Represents comments made on tasks by users.

-   `id`: `INTEGER` (Primary Key, Auto-incrementing)
-   `content`: `TEXT` (Not Null)
-   `userId`: `INTEGER` (Not Null, Foreign Key to `users.id`, `onDelete: cascade`)
-   `taskId`: `INTEGER` (Not Null, Foreign Key to `tasks.id`, `onDelete: cascade`)
-   `createdAt`: `TIMESTAMP with timezone` (Default: Current timestamp)

### workspaceMembers

Junction table for users and workspaces, defining membership within a workspace.

-   `id`: `INTEGER` (Primary Key, Auto-incrementing)
-   `userId`: `INTEGER` (Not Null, Foreign Key to `users.id`, `onDelete: cascade`)
-   `workspaceId`: `INTEGER` (Not Null, Foreign Key to `workspaces.id`, `onDelete: cascade`)
-   `role`: `SMALLINT` (Default: `0`)
-   Unique Index: `(userId, workspaceId)`

### projectMembers

Junction table for users and projects, defining membership within a project.

-   `id`: `INTEGER` (Primary Key, Auto-incrementing)
-   `userId`: `INTEGER` (Not Null, Foreign Key to `users.id`, `onDelete: cascade`)
-   `projectId`: `INTEGER` (Not Null, Foreign Key to `projects.id`, `onDelete: cascade`)
-   Unique Index: `(userId, projectId)`

## Relationships

The `relations.js` file defines the following relationships between the tables:

### User Relations

-   `users` can have many `ownedWorkspaces`.
-   `users` can have many `workspaceMemberships`.
-   `users` can have many `ownedProjects`.
-   `users` can have many `projectMemberships`.
-   `users` can have many `assignedTasks`.
-   `users` can have many `comments`.

### Workspace Relations

-   `workspaces` has one `owner` (a `user`).
-   `workspaces` can have many `projects`.
-   `workspaces` can have many `members` (via `workspaceMembers`).

### Project Relations

-   `projects` belongs to one `workspace`.
-   `projects` has one `owner` (a `user`, specifically the `teamLead`).
-   `projects` can have many `tasks`.
-   `projects` can have many `members` (via `projectMembers`).

### Task Relations

-   `tasks` belongs to one `project`.
-   `tasks` is assigned to one `assignee` (a `user`).
-   `tasks` can have many `comments`.

### Comment Relations

-   `comments` are made by one `user`.
-   `comments` belongs to one `task`.

### Workspace Members Relations

-   `workspaceMembers` connects to one `workspace`.
-   `workspaceMembers` connects to one `member` (a `user`).

### Project Members Relations

-   `projectMembers` connects to one `project`.
-   `projectMembers` connects to one `member` (a `user`).
