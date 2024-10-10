import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Store, configure, authorize, logout, remove, encrypt, decrypt } from 'iltio'
import { Authentication, Encryption } from 'iltio/react'
import { useQuery, useMutation } from '@apollo/client'
import { ApolloProvider } from '@apollo/client'
import { getPostsQuery, addPostMutation, createClient } from './interface'

configure({ token: 'demo-jwt', storage: window.localStorage })

function AddPost() {
  const [addPost, { error, loading }] = useMutation<any, { content: string; user: string }>(
    addPostMutation,
    {
      refetchQueries: [{ query: getPostsQuery }],
    },
  )

  if (error) return <p>Error loading data.</p>
  if (loading) return <p>Loading data.</p>

  return (
    <form
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 20,
        padding: 20,
        border: '1px solid black',
        alignSelf: 'normal',
      }}
      onSubmit={async (event: any) => {
        event.preventDefault()
        const variables = await encrypt({ content: event.target[0].value, user: Store.uid }, [
          'user',
        ])
        if (variables) {
          await addPost({ variables })
        } else {
          alert('Failed to encrypt data.')
        }
        event.target[0].value = ''
      }}
    >
      <input
        style={{ display: 'flex', flex: 1, border: 'none', outline: 'none' }}
        placeholder="Your message"
      />
      <button
        style={{
          border: 'none',
          background: 'lightgray',
          padding: 10,
          color: 'black',
          cursor: 'pointer',
        }}
        type="submit"
      >
        Post
      </button>
    </form>
  )
}

function Posts() {
  const { loading, error, data } = useQuery(getPostsQuery)
  const [posts, setPosts] = useState<{ id: number; content: string; createdAt: string }[]>([])
  const [isDecrypting, setIsDecrypting] = useState(true)

  useEffect(() => {
    if (data?.post) {
      // Decrypt posts when data is available
      const decryptPosts = async () => {
        setIsDecrypting(true)
        // Copy post, as it's properties are marked as read-only by apollo.
        const decryptedPosts = await Promise.all(
          (data.post as { id: number; content: string; createdAt: string }[]).map((post) =>
            decrypt({ ...post }, ['id', 'createdAt']),
          ),
        )
        setPosts(decryptedPosts)
        setIsDecrypting(false)
      }

      decryptPosts()
    }
  }, [data])

  if (error) return <p>Error loading data.</p>
  if (loading) return <p>Loading data.</p>
  if (posts.length === 0) return <p>No posts yet, start posting!</p>
  if (isDecrypting) return <p>Decrypting data...</p>

  return (
    <div>
      {posts.map((post) => (
        <p key={post.id}>
          {post.content} {post.createdAt}
        </p>
      ))}
    </div>
  )
}

const App = () => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      return
    }
    const load = async () => {
      if (Store.token) {
        const { error, name } = await authorize()

        if (error) {
          await logout()
          window.location.reload()
        }

        if (name) {
          setName(name)
        }
      }

      setLoading(false)
    }
    load()
  }, [loading, setLoading])

  if (loading) {
    return <p>Loading</p>
  }

  if (name) {
    return (
      <ApolloProvider client={createClient(Store.jsonWebToken)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignSelf: 'normal' }}>
          <span>Logged in as: {name}</span>
          <button
            style={{
              border: 'none',
              background: 'black',
              color: 'white',
              padding: 10,
              cursor: 'pointer',
            }}
            onClick={() => {
              logout()
              setName('')
            }}
          >
            Logout
          </button>
          <button
            style={{
              border: 'none',
              background: 'black',
              color: 'white',
              padding: 10,
              cursor: 'pointer',
            }}
            onClick={async () => {
              await remove()
              setName('')
            }}
          >
            Delete my Account
          </button>
          <div
            id="encryption"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <h3>Client-side Encryption</h3>
            <Encryption onDone={() => alert('Done!')} />
            <h2>Your Encrypted Social Network</h2>
            <AddPost />
            <Posts />
          </div>
        </div>
      </ApolloProvider>
    )
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 40,
          justifyContent: 'center',
        }}
      >
        <div id="base" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p>Regular Form</p>
          <Authentication
            onSuccess={(name, token, registration) => {
              console.log('success', name, token, registration)
              setName(name)
            }}
          />
        </div>
      </div>
      <p style={{ margin: 0 }}>
        Enter an email address or phone number above to register or login to the demo application.
      </p>
    </>
  )
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      fontFamily: 'sans-serif',
      gap: 20,
    }}
  >
    <h1 style={{ marginBottom: 0 }}>iltio Encryption Demo</h1>
    <p style={{ margin: 0 }}>Hasura app with authentication and client-side encryption</p>
    <App />
    <hr
      style={{
        width: '100%',
        background: '#EFEFEF',
        height: 1,
        border: 'none',
      }}
    />
    <div style={{ display: 'flex', justifySelf: 'flex-end', gap: 20 }}>
      <a
        style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}
        href="https://iltio.com/getting-started"
      >
        Documentation
      </a>
      <a
        style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}
        href="https://github.com/tobua/iltio"
      >
        GitHub
      </a>
    </div>
  </div>,
)
