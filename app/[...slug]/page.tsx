import { Auth, Dashboard, Workspace } from '@/components/life-app'

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const path = slug.join('/')
  if (path === 'login') return <Auth />
  if (path === 'register') return <Auth register />
  if (path === 'dashboard') return <Dashboard />
  return <Workspace slug={path} />
}
