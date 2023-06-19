import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export const createClient = (token: string) => {
  return new ApolloClient({
    uri: 'https://iltio-next-demo.hasura.app/v1/graphql',
    cache: new InMemoryCache(),
    headers: {
      'x-token': token,
    },
  })
}

export const getProjectsQuery = gql`
  query GetProjects {
    project {
      id
      name
      tasks {
        done
        id
        name
      }
    }
  }
`

export const addProjectMutation = gql`
  mutation AddProjectMutation($name: String!) {
    insert_project_one(object: { name: $name }) {
      id
    }
  }
`

export const addTaskMutation = gql`
  mutation AddTaskMutation($name: String!, $project: Int!) {
    insert_task_one(object: { name: $name, project: $project }) {
      id
    }
  }
`

export const updateProjectMutation = gql`
  mutation UpdateProjectMutation($id: Int!, $done: Boolean!) {
    update_task_by_pk(pk_columns: { id: $id }, _set: { done: $done }) {
      id
    }
  }
`
