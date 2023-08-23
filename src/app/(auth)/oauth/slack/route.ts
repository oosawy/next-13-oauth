import { redirect } from 'next/navigation'
import { authorize } from '../lib'

export async function GET(request: Request) {
  const from = new URL(request.url).searchParams.get('from') || '/'

  const authorizeUrl = await authorize({ from })

  redirect(authorizeUrl)
}
