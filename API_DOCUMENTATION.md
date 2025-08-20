# API Documentation

## GraphQL Endpoint
- **URL**: `http://127.0.0.1:8000/graphql/`
- **Method**: POST
- **Headers**: 
  - `Content-Type: application/json`
  - `X-Organization-Slug: <organization-slug>` (required for multi-tenancy)

## Schema Overview

### Types

#### Organization
```graphql
type OrganizationType {
  id: ID!
  name: String!
  slug: String!
  contactEmail: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

#### Project
```graphql
type ProjectType {
  id: ID!
  name: String!
  description: String
  status: String!
  dueDate: Date
  taskCount: Int
  completionRate: Float
  createdAt: DateTime!
  updatedAt: DateTime!
  organization: OrganizationType!
  tasks: [TaskType!]!
}
```

#### Task
```graphql
type TaskType {
  id: ID!
  title: String!
  description: String
  status: String!
  assigneeEmail: String
  dueDate: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
  project: ProjectType!
  comments: [TaskCommentType!]!
}
```

#### TaskComment
```graphql
type TaskCommentType {
  id: ID!
  content: String!
  authorEmail: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  task: TaskType!
}
```

### Queries

#### Get All Organizations
```graphql
query {
  organizations {
    id
    name
    slug
    contactEmail
  }
}
```

#### Get Current Organization
```graphql
query {
  organization {
    id
    name
    slug
    contactEmail
  }
}
```

#### Get All Projects
```graphql
query {
  projects {
    id
    name
    description
    status
    dueDate
    taskCount
    completionRate
  }
}
```

#### Get Project Details
```graphql
query GetProjectDetails($id: ID!) {
  project(id: $id) {
    id
    name
    description
    dueDate
    tasks {
      id
      title
      description
      status
      assigneeEmail
      comments {
        id
        content
        authorEmail
        createdAt
      }
    }
  }
}
```

#### Get Tasks for Project
```graphql
query GetTasks($projectId: ID!) {
  tasks(projectId: $projectId) {
    id
    title
    description
    status
    assigneeEmail
    dueDate
  }
}
```

### Mutations

#### Create Organization
```graphql
mutation CreateOrganization($name: String!, $contactEmail: String!) {
  createOrganization(name: $name, contactEmail: $contactEmail) {
    organization {
      id
      name
      slug
      contactEmail
    }
  }
}
```

#### Create Project
```graphql
mutation CreateProject($name: String!, $description: String, $dueDate: Date) {
  createProject(name: $name, description: $description, dueDate: $dueDate) {
    project {
      id
      name
      description
      status
      dueDate
    }
  }
}
```

#### Create Task
```graphql
mutation CreateTask($title: String!, $description: String, $assigneeEmail: String, $projectId: ID!) {
  createTask(title: $title, description: $description, assigneeEmail: $assigneeEmail, projectId: $projectId) {
    task {
      id
      title
      description
      status
      assigneeEmail
    }
  }
}
```

#### Update Task
```graphql
mutation UpdateTask($id: ID!, $title: String, $description: String, $status: String, $assigneeEmail: String) {
  updateTask(id: $id, title: $title, description: $description, status: $status, assigneeEmail: $assigneeEmail) {
    task {
      id
      title
      description
      status
      assigneeEmail
    }
  }
}
```

#### Add Comment to Task
```graphql
mutation AddCommentToTask($content: String!, $authorEmail: String!, $taskId: ID!) {
  addCommentToTask(content: $content, authorEmail: $authorEmail, taskId: $taskId) {
    comment {
      id
      content
      authorEmail
      createdAt
    }
  }
}
```

## Status Values

### Project Status
- `ACTIVE` - Project is currently active
- `COMPLETED` - Project has been completed
- `ON_HOLD` - Project is temporarily paused
- `CANCELLED` - Project has been cancelled

### Task Status
- `TODO` - Task is not started
- `IN_PROGRESS` - Task is currently being worked on
- `DONE` - Task has been completed

## Multi-Tenancy

All queries and mutations require the `X-Organization-Slug` header to identify the organization context. Data is automatically filtered based on this organization.

Example:
```bash
curl -X POST \
  http://127.0.0.1:8000/graphql/ \
  -H 'Content-Type: application/json' \
  -H 'X-Organization-Slug: default-organization' \
  -d '{"query": "{ projects { id name } }"}'
```

## Error Handling

The API returns standard GraphQL errors with descriptive messages:

```json
{
  "errors": [
    {
      "message": "Organization not found in context",
      "locations": [{"line": 2, "column": 3}],
      "path": ["createProject"]
    }
  ]
}
```

Common error scenarios:
- Missing or invalid `X-Organization-Slug` header
- Attempting to access resources from different organizations
- Validation errors on required fields
- Database constraint violations
