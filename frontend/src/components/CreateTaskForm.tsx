import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $projectId: ID!, $description: String, $assigneeEmail: String) {
    createTask(title: $title, projectId: $projectId, description: $description, assigneeEmail: $assigneeEmail) {
      task {
        id
        title
        description
        status
        assigneeEmail
      }
    }
  }
`;

const CreateTaskForm = ({ projectId, onTaskCreated }: { projectId: string; onTaskCreated: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeEmail, setAssigneeEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  const [createTask, { loading, error }] = useMutation(CREATE_TASK, {
    onCompleted: () => {
      onTaskCreated();
      setTitle('');
      setDescription('');
      setAssigneeEmail('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Task title is required.');
      return;
    }
    setValidationError('');
    createTask({ variables: { title, projectId, description, assigneeEmail } });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-700">Create New Task</h3>
      <div className="mt-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mt-4">
        <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="assigneeEmail" className="block text-sm font-medium text-gray-700">Assignee Email</label>
        <input
          type="email"
          id="assigneeEmail"
          value={assigneeEmail}
          onChange={(e) => setAssigneeEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
            {validationError && <p className="mt-2 text-sm text-red-600">{validationError}</p>}
      <div className="mt-6">
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">Error: {error.message}</p>}
    </form>
  );
};

export default CreateTaskForm;
