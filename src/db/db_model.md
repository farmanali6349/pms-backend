// Tables

/\*\*

- 1.  User
- 2.  Workspace
- 3.  Project
- 4.  Task
- 5.  Comment
-
- - Junction Tables
- 6.  Workspace Member
- 7.  Project Member
      \*/

/\*\*

- USER RELATION
- user [one --> many] workspace (Owner)
- user [one --> many] workspace_member
- user [one --> many] projects (Owner)
- user [one --> many] project_member
- user [one --> many] task
- user [one == one] comment
  \*/

/\*\*

- WOKRSPACE RELATION
- workspace [one --> many] workspace_member
- workspace [one --> many] project
  \*/

/\*\*

- PROJECT RELATION
- project [one --> many] project_member
- project [one --> many] task
  \*/

/\*\*

- TASK RELATION
- task [one --> many] comment
  \*/
