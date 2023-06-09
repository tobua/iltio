import { useRouter } from 'next/router.js'
import { CookieStorage } from 'iltio'
import { Authentication } from 'iltio/react'

export default function Home() {
  const router = useRouter()

  return (
    <Authentication
      configuration={{
        url: '/api/authentication',
        token: 'demo',
        storage: CookieStorage,
      }}
      onSuccess={() => router.push('/user')}
    />
  )
}
