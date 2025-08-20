import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import CreateProjectForm from './CreateProjectForm';
import EditProjectForm from './EditProjectForm';

const GET_PROJECTS = gql`
  query GetProjects {
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
`;

const Dashboard = () => {
  const orgSlug = (typeof window !== 'undefined' && window.localStorage.getItem('orgSlug')) || 'default-organization';
  const { loading, error, data, refetch } = useQuery(GET_PROJECTS, {
    fetchPolicy: 'no-cache',
  });
  const [editingProject, setEditingProject] = useState<any>(null);

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-red-500 text-center">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-lg font-semibold">Error loading projects</p>
          <p className="text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };



  return (
    <div key={orgSlug} className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Project Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage your projects and track progress</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border">
                <span className="text-sm text-gray-500">Total Projects</span>
                <p className="text-2xl font-bold text-gray-900">{data?.projects?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                {data?.projects?.map((project: any) => (
                  <div key={project.id} className="group bg-white rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          
                          <div>
                            <Link to={`/project/${project.id}`} className="block">
                              <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {project.name}
                              </h4>
                            </Link>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                              {project.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingProject(project);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">{project.description || 'No description provided'}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-13h10a2 2 0 012 2v11a2 2 0 01-2 2H9m0-13v13" />
                            </svg>
                            <span className="text-gray-600">{project.taskCount || 0} tasks</span>
                          </div>
                          {project.taskCount > 0 && (
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-gray-600">{Math.round(project.completionRate || 0)}% complete</span>
                            </div>
                          )}
                        </div>
                        {project.dueDate && (
                          <div className="flex items-center space-x-1 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      {project.taskCount > 0 && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.completionRate || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {data?.projects?.length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-600">Create your first project to get started</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <CreateProjectForm onProjectCreated={refetch} />
          </div>
        </div>
      </div>
      
      {editingProject && (
        <EditProjectForm
          project={editingProject}
          onProjectUpdated={() => {
            setEditingProject(null);
            refetch();
          }}
          onCancel={() => setEditingProject(null)}
        />
      )}

     
      <div className="container mx-auto px-6 py-6">
        <div className="text-center text-sm text-gray-600">
          <Link to="/change-organization" className="text-blue-600 hover:text-blue-700 underline">
            Change Organization
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
