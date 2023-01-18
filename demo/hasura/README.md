# iltio - Hasura React Demo

Try out the [live demo](https://iltio-hasura-demo.vercel.app) of this example.

## Hasura Cloud

To get your own GraphQL backend instance register a free account for the [Hasura Cloud](https://cloud.hasura.io/signup). Use your own database or connect a free NEON postgres database when prompted.

After the registration you'll be redirected to the Hasura Cloud dashboard. Make sure to copy the `GraphQL API` link and paste it into the application in file `interface.ts`. While in the dashboard go to **Env vars** and add the `HASURA_GRAPHQL_AUTH_HOOK` variable with the value `https://iltio.com/api/hasura`. This will ensure that every request to the GraphQL API will be authorized through this webhook.

Once that's configured click **Launch Console** which will open the GraphQL explorer in a new window. The database is still empty, so let's add a `project` table with the following fields:

| Column | Type                 |
| ------ | -------------------- |
| id     | integer, primary key |
| name   | text                 |
| user   | text                 |

and a new `task` table with these fields:

| Column  | Type                    |
| ------- | ----------------------- |
| id      | integer, primary key    |
| name    | text                    |
| done    | boolean, default: false |
| project | integer                 |
| user    | text                    |

Now with both tables available, let's add a **Relationship** to the `project` table. As the relationship type choose "Array Relationship" enter `task` as the name (name will later be used in the GQL query) pick the `task` table as the reference and link it's project field to the id of the `project` table.

Last but not least the permissions have to be configured for both tables to ensure users can only use the API when authenticated. The permissions will also ensure that a user can only retrieve and edit their own projects. To do this head on over to the **Permissions** tab in the project table.

Add a new role called `user` and click on the insert permissions that should currently be marked as ❌. Under "Row insert permissions" add a new check like this to ensure the user in the table matches the authorized user from the webhook.

```json
{
  "user": {
    "_eq": "X-Hasura-User-Id"
  }
}
```

and for "Column insert permissions" check only the `name` field as the others will be inserted automatically. Under "Column persets" add "user -> from session variable -> X-Hasura-User-Id". That's it for the insert permission. For the select permission add the same row check as previously to ensure a user can only read their own projects. Extend the column permissions to return the `id` and `name` field.

For the task table we will add more or less the same permissions including an update permission where only the `done` field can be edited.

## The Code

The following app will first show the iltio `<Form />` to promt the user to authenticate. Once the user is logged in the Apollo client is created with the token added to the header allowing for the `Projects` component being rendered inside an `ApolloProvider`.

```jsx
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import { Form, Store } from 'iltio'
import { createClient } from './interface'
import { Projects } from './projects'

function App() {
  const [loggedIn, setLoggedIn] = useState(!!Store.token)

  if (loggedIn) {
    return (
      <ApolloProvider client={createClient(Store.token)}>
        <Projects />
      </ApolloProvider>
    )
  }

  return <Form configuration={{ token: 'demo' }} onSuccess={() => setLoggedIn(true)} />
}
```

The projects component contains all the query and mutation hooks necessary to load and manipulate the data.

```jsx
import { useQuery } from '@apollo/client'
import { getProjectsQuery } from './interface'

export function Projects() {
  const { loading, error, data } = useQuery(getProjectsQuery)

  if (error) return <p>Error loading data.</p>
  if (loading) return <p>Loading data.</p>

  return (
    <div>
      {data.project.map((project) => (
        <p key={project.id}>{project.name}</p>
      ))}
    </div>
  )
}
```

The GraphQL queries and muations reside in a separate file `interface.ts` where also the client is instanciated. When using your own GraphQL Cloud instance make sure to edit the url to point to your instance and on the `Form` component replace the `demo` token with your own `APP_TOKEN` which you get after registering for [iltio](https://iltio.com/authenticate).
