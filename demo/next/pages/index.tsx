import { useRouter } from 'next/router'
import { Form, CookieStorage } from 'iltio'

export default function Home() {
  const router = useRouter()

  return (
    <Form
      configuration={{
        url: '/api/authentication',
        token: 'demo',
        storage: CookieStorage,
      }}
      onSuccess={() => router.push('/user')}
    />
  )
}
