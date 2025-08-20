import React from 'react';
import { gql, useQuery, useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      slug
    }
  }
`;

const ChangeOrganization: React.FC = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const { loading, error, data } = useQuery(GET_ORGANIZATIONS);

  const current = (typeof window !== 'undefined' && window.localStorage.getItem('orgSlug')) || 'default-organization';

  const handleSelect = async (slug: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('orgSlug', slug);
    }
    // Clear Apollo cache to prevent stale results from previous org
    try {
      await client.clearStore();
    } catch (e) {
      // no-op
    }
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-gray-600">Loading organizations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        Failed to load organizations: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Change Organization</h2>
      <p className="text-gray-600 mb-6">Select an organization to view its dashboard. This only updates the testing header used for multi-tenancy.</p>

      <ul className="space-y-3">
        {data?.organizations?.map((org: any) => (
          <li key={org.id}>
            <button
              onClick={() => handleSelect(org.slug)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border shadow-sm hover:shadow-md transition ${
                current === org.slug ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div>
                <div className="font-semibold text-gray-900">{org.name}</div>
                <div className="text-sm text-gray-500">{org.slug}</div>
              </div>
              {current === org.slug && (
                <span className="text-blue-600 text-sm font-medium">Current</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {(!data || data.organizations.length === 0) && (
        <div className="text-gray-600">No organizations found.</div>
      )}
    </div>
  );
};

export default ChangeOrganization;
