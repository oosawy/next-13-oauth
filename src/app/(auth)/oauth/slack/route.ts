import { redirect } from 'next/navigation'
import { authorize } from '../lib'

export async function GET(request: Request) {
  const from = new URL(request.url).searchParams.get('from') || '/'
  const callbackType =
    new URL(request.url).searchParams.get('callbackType') ?? 'popup'

  const authorizeUrl = await authorize({ from, callbackType })

  redirect(authorizeUrl)
}
