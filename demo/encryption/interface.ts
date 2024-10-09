import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export const createClient = (token: string) => {
  return new ApolloClient({
    uri: 'https://iltio-encryption.hasura.app/v1/graphql',
    cache: new InMemoryCache(),
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET as string,
    },
  })
}

export const getPostsQuery = gql`
  query GetPosts {
    post {
      id
      content
      created_at
    }
  }
`

export const addPostMutation = gql`
  mutation AddPostMutation($content: String!, $user: uuid!) {
    insert_post_one(object: { content: $content, user: $user }) {
      id
    }
  }
`
