import Head from 'next/head'
import { useRouter } from 'next/router'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { Form } from 'iltio'
import { parse } from 'cookie'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>iltio Next.JS Demo</title>
        <meta
          name="description"
          content="Demoes authentication with iltio featuring an interface proxy and first-party cookie."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${inter.className} ${styles.main}`}>
        <div className={styles.center}>
          <h1>iltio Next.js Demo</h1>
          <Form
            configuration={{
              url: '/api/authentication',
              token: 'demo',
              storage: {
                getItem: (key: string) => {
                  const cookies = parse(document.cookie)
                  return cookies[key]
                },
                // Set done on server.
                setItem: () => null,
                removeItem: () => null,
              },
            }}
            onSuccess={() => router.push('/user')}
          />
          <hr className={styles.separator} />
          <div style={{ display: 'flex', justifySelf: 'flex-end', gap: 20 }}>
            <a className={styles.link} href="https://iltio.com/getting-started">
              Documentation
            </a>
            <a className={styles.link} href="https://github.com/tobua/iltio">
              GitHub
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
