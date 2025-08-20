# Project Management System

This is a multi-tenant project management system built with a Django/GraphQL backend and a React/TypeScript frontend. It provides organization-based data isolation, allowing different organizations to manage their projects and tasks securely.

## Features

- **Multi-Tenancy:** Data is partitioned by organization, ensuring that users from one organization cannot access data from another.
- **Project Dashboard:** View a list of all projects for your organization.
- **Project Creation:** Easily create new projects with a name, description, and due date.
- **Task Management:** Within each project, create, update, and manage tasks.
- **Task Status Tracking:** Change the status of tasks (To Do, In Progress, Done).
- **Commenting:** Add comments to tasks to facilitate collaboration.
- **GraphQL API:** A powerful and flexible API for all frontend-backend communication.

## Tech Stack

- **Backend:**
  - Django 4.x
  - Graphene-Django (for GraphQL)
  - Python 3.10+
  - PostgreSQL

- **Frontend:**
  - React 18+
  - TypeScript
  - Apollo Client (for GraphQL)
  - React Router
  - Tailwind CSS

## Setup and Installation

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- PostgreSQL database

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd VoiceAIWrapper-task/backend  
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure environment variables:**
    Create a `.env` file in the `backend` directory and add your database settings:
    ```
    SECRET_KEY='your-django-secret-key'
    DEBUG=True
    DB_NAME='your_db_name'
    DB_USER='your_db_user'
    DB_PASSWORD='your_db_password'
    DB_HOST='localhost'
    DB_PORT='5432'
    ```

5.  **Run database migrations:**
    ```bash
    python manage.py migrate
    ```

6.  **Seed initial data:**
    This command creates a default organization with the slug `default-org`.
    ```bash
    python manage.py seed_data
    ```

7.  **Run the backend server:**
    ```bash
    python manage.py runserver
    ```
    The backend will be available at `http://127.0.0.1:8000/graphql/`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the frontend development server:**
    ```bash
    npm start
    ```
    The frontend will be available at `http://localhost:3000`.

## How to Use

1.  Once both the backend and frontend servers are running, open your browser to `http://localhost:3000`.
2.  You will see the project dashboard for the default organization (`default-org`).
3.  You can create new projects, click on a project to view its tasks, add new tasks, change task statuses, and add comments.

## API Communication

The frontend communicates with the backend via GraphQL. For multi-tenancy to work, every API request must include the `X-Organization-Slug` header. The Apollo Client is configured to send `default-org` with each request.
