import React from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import CreateTaskForm from './CreateTaskForm';
import AddCommentForm from './AddCommentForm';

const GET_PROJECT_DETAILS = gql`
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
`;

const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: ID!, $status: String!) {
    updateTask(id: $id, status: $status) {
      task {
        id
        status
      }
    }
  }
`;

const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { loading, error, data, refetch } = useQuery(GET_PROJECT_DETAILS, {
    variables: { id: projectId },
  });
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.project) return <p>Project not found.</p>;

  const { project } = data;

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateTaskStatus({ variables: { id: taskId, status: newStatus } });
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-800">{project.name}</h2>
      <p className="mt-2 text-gray-600">{project.description}</p>
      {project.dueDate && (
        <p className="mt-2 text-sm text-gray-500">Due: {project.dueDate}</p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold text-gray-700">Tasks</h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {project.tasks.length > 0 ? (
              project.tasks.map((task: any) => (
                                <div key={task.id} className="p-6 bg-white rounded-lg shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">{task.title}</h4>
                      <p className="mt-2 text-gray-600">{task.description}</p>
                    </div>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                  {task.assigneeEmail && (
                    <p className="mt-2 text-sm text-gray-500">Assignee: {task.assigneeEmail}</p>
                  )}
                  <div className="mt-4">
                    <h5 className="text-md font-semibold text-gray-700">Comments</h5>
                    <div className="mt-2 space-y-2">
                      {task.comments.map((comment: any) => (
                        <div key={comment.id} className="p-2 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-800">{comment.content}</p>
                          <p className="text-xs text-gray-500">- {comment.authorEmail} on {new Date(comment.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                    <AddCommentForm taskId={task.id} onCommentAdded={refetch} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tasks yet.</p>
            )}
          </div>
        </div>
        <div>
          {projectId && <CreateTaskForm projectId={projectId} onTaskCreated={refetch} />}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
