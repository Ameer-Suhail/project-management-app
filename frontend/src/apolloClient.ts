import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:8000/graphql/',
});

const authLink = setContext((_, { headers }) => {
  // For now, we'll hardcode the organization slug. In a real app, this would
  // be dynamic, based on the user's session or selected organization.
  const organizationSlug = 'default-organization'; // Replace with a dynamic value later

  return {
    headers: {
      ...headers,
      'X-Organization-Slug': organizationSlug,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
