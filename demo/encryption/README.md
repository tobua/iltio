# Setup Hasura with Encryption from Scratch

Create a new project in the hasura console. Add a `PG_DATABASE_URL` pointing to an empty database. Now launch the hasura console and connect to the database using said environment variable.

Create a `post` table with the following fields:

| Column     | Type                                  |
| ---------- | ------------------------------------- |
| id         | integer (auto-increment), primary key |
| content    | text                                  |
| user       | UUID                                  |
| created_at | timestamp, default now()              |

Once the table is created to the the **Permissions** tab for this table and add a new role called `user`. And for **insert** add a **Row insert permission** with a new **custom check** as `{ "user": { "_eq" : "X-Hasura-User-Id" } }`. This will ensure a user can only insert and read their own posts. Before clicking **Save Permissions**, select `content` and `user` as the **Column insert permissions**. Then add the same check for **select** except `id`, `content` and `created_at` as readable.

## Hasura JWT

To enable JWT authorization on hasura add the `HASURA_GRAPHQL_JWT_SECRET` environment variable. The secret itself has to be encoded in a specific way which includes the algorithm used. It's possible to verify JWT tokens on the hasura side with only a public token, where it's not possible for that host to issue any new tokens. In our case we use the simpler version where we directly pass the secret key.

```
HASURA_GRAPHQL_JWT_SECRET='{"type":"HS256", "key": "KEY"}'
```

When switching to public key encryption encode the key like this:

```
HASURA_GRAPHQL_JWT_SECRET='{"type":"RS512", "key": "-----BEGIN PUBLIC KEY-----\nKEY\n-----END PUBLIC KEY-----\n"}'
```
