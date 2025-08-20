import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
      task { id status }
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!,
    $title: String,
    $description: String,
    $assigneeEmail: String,
    $status: String
  ) {
    updateTask(
      id: $id,
      title: $title,
      description: $description,
      assigneeEmail: $assigneeEmail,
      status: $status
    ) {
      task { id title description assigneeEmail status }
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) { deleteTask(id: $id) { ok } }
`;

const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { loading, error, data, refetch } = useQuery(GET_PROJECT_DETAILS, {
    variables: { id: projectId },
    fetchPolicy: 'no-cache',
  });
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, { title: string; description: string; assigneeEmail: string; status: string }>>({});

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4 text-center">Loading project...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-red-500 text-center">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-lg font-semibold">Error loading project</p>
          <p className="text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    </div>
  );
  
  if (!data || !data.project) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Project not found</h3>
        <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">← Back to Dashboard</Link>
      </div>
    </div>
  );

  const { project } = data;

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateTaskStatus({ 
      variables: { id: taskId, status: newStatus },
      onCompleted: () => refetch()
    });
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DONE': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">← Back to Dashboard</Link>
        </nav>

        {/* Project Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{project.description || 'No description provided'}</p>
              
              <div className="flex items-center space-x-6 text-sm">
                {project.dueDate && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-13h10a2 2 0 012 2v11a2 2 0 01-2 2H9m0-13v13" />
                  </svg>
                  <span className="text-gray-600">{project.tasks.length} tasks</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tasks</h2>
              <p className="text-gray-600">Manage and track your project tasks</p>
            </div>
            
            {project.tasks.length > 0 ? (
              <div className="space-y-4">
                {project.tasks.map((task: any) => (
                  <div key={task.id} className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-all duration-200">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
                            <p className="text-gray-600 mb-3">{task.description || 'No description provided'}</p>
                            
                            <div className="flex items-center space-x-4 mb-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTaskStatusColor(task.status)}`}>
                                {task.status.replace('_', ' ')}
                              </span>
                              {task.assigneeEmail && (
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  <span>{task.assigneeEmail}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium bg-white"
                          >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                          </select>
                          
                          <button
                            onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <svg className={`w-5 h-5 transform transition-transform ${expandedTask === task.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {expandedTask === task.id && (
                        <div className="border-t pt-6 mt-6">
                          {/* Edit Section */}
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Task
                          </h4>

                          {(() => {
                            const vals = editValues[task.id] || { title: task.title || '', description: task.description || '', assigneeEmail: task.assigneeEmail || '', status: task.status };
                            return (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                  <input
                                    type="text"
                                    value={vals.title}
                                    onChange={(e) => setEditValues({ ...editValues, [task.id]: { ...vals, title: e.target.value } })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">Assignee Email</label>
                                  <input
                                    type="email"
                                    value={vals.assigneeEmail}
                                    onChange={(e) => setEditValues({ ...editValues, [task.id]: { ...vals, assigneeEmail: e.target.value } })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                  <textarea
                                    rows={3}
                                    value={vals.description}
                                    onChange={(e) => setEditValues({ ...editValues, [task.id]: { ...vals, description: e.target.value } })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                  <select
                                    value={vals.status}
                                    onChange={(e) => setEditValues({ ...editValues, [task.id]: { ...vals, status: e.target.value } })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                  >
                                    <option value="TODO">To Do</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DONE">Done</option>
                                  </select>
                                </div>
                                <div className="flex items-center gap-3 md:col-span-2">
                                  <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    onClick={async () => {
                                      const v = editValues[task.id] || vals;
                                      await updateTask({ variables: { id: task.id, title: v.title, description: v.description, assigneeEmail: v.assigneeEmail, status: v.status } });
                                      setExpandedTask(null);
                                      refetch();
                                    }}
                                  >
                                    Save Changes
                                  </button>
                                  <button
                                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                                    onClick={async () => {
                                      if (typeof window !== 'undefined' && window.confirm('Delete this task?')) {
                                        await deleteTask({ variables: { id: task.id } });
                                        setExpandedTask(null);
                                        refetch();
                                      }
                                    }}
                                  >
                                    Delete Task
                                  </button>
                                </div>
                              </div>
                            );
                          })()}

                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Comments ({task.comments.length})
                          </h4>
                          
                          <div className="space-y-3 mb-6">
                            {task.comments.length > 0 ? (
                              task.comments.map((comment: any) => (
                                <div key={comment.id} className="bg-gray-50 rounded-xl p-4">
                                  <p className="text-gray-900 mb-2">{comment.content}</p>
                                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>{comment.authorEmail}</span>
                                    <span>•</span>
                                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-center py-4">No comments yet</p>
                            )}
                          </div>
                          
                          <AddCommentForm taskId={task.id} onCommentAdded={refetch} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-13h10a2 2 0 012 2v11a2 2 0 01-2 2H9m0-13v13" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-600">Create your first task to get started</p>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            {projectId && <CreateTaskForm projectId={projectId} onTaskCreated={refetch} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
