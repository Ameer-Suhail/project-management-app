import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const ADD_COMMENT = gql`
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
`;

const AddCommentForm = ({ taskId, onCommentAdded }: { taskId: string; onCommentAdded: () => void }) => {
  const [content, setContent] = useState('');
  const [authorEmail] = useState('user@example.com'); // Hardcoded for now
  const [validationError, setValidationError] = useState('');

  const [addComment, { loading, error }] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      onCommentAdded();
      setContent('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setValidationError('Comment cannot be empty.');
      return;
    }
    setValidationError('');
    addComment({ variables: { content, authorEmail, taskId } });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        rows={2}
        required
      ></textarea>
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="mt-2 py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Comment'}
      </button>
      {validationError && <p className="mt-2 text-sm text-red-600">{validationError}</p>}
      {error && <p className="mt-2 text-sm text-red-600">Error: {error.message}</p>}
    </form>
  );
};

export default AddCommentForm;
