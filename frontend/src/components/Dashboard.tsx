import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import CreateProjectForm from './CreateProjectForm';

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      dueDate
    }
  }
`;

const Dashboard = () => {
  const { loading, error, data, refetch } = useQuery(GET_PROJECTS);

  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-800">Dashboard</h2>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold text-gray-700">Projects</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="mt-4 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {data.projects.map((project: any) => (
                <Link to={`/project/${project.id}`} key={project.id} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <h4 className="text-lg font-bold text-gray-800">{project.name}</h4>
                  <p className="mt-2 text-gray-600 truncate">{project.description}</p>
                  {project.dueDate && (
                    <p className="mt-2 text-sm text-gray-500">Due: {project.dueDate}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div>
          <CreateProjectForm onProjectCreated={refetch} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
