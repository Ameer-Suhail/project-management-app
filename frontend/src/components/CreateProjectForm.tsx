import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const CREATE_PROJECT = gql`
  mutation CreateProject($name: String!, $description: String, $dueDate: Date) {
    createProject(name: $name, description: $description, dueDate: $dueDate) {
      project {
        id
        name
        description
        dueDate
      }
    }
  }
`;

const CreateProjectForm = ({ onProjectCreated }: { onProjectCreated: () => void }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [validationError, setValidationError] = useState('');

  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT, {
    onCompleted: () => {
      onProjectCreated();
      setName('');
      setDescription('');
      setDueDate('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('Project name is required.');
      return;
    }
    setValidationError('');
    createProject({ variables: { name, description, dueDate: dueDate || null } });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-700">Create New Project</h3>
      <div className="mt-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mt-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      {validationError && <p className="mt-2 text-sm text-red-600">{validationError}</p>}
      <div className="mt-6">
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">Error: {error.message}</p>}
    </form>
  );
};

export default CreateProjectForm;
