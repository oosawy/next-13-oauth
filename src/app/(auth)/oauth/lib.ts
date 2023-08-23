import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const redirect_uri = `${process.env.NEXT_PUBLIC_URL}/oauth/callback`

export async function authorize({ from }: { from: string }) {
  const state = Math.random().toString(36).substring(2)

  const url = new URL('https://slack.com/oauth/v2/authorize')
  url.searchParams.append('client_id', process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!)
  url.searchParams.append('redirect_uri', redirect_uri)
  url.searchParams.append('state', state)
  url.searchParams.append('scope', 'channels:history')

  cookies().set(
    'oauth_state',
    JSON.stringify({
      from,
      provider: 'slack',
      redirect_uri,
      state,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 5,
    }
  )

  return url.toString()
}

export async function callback(param: { code: string; state: string }) {
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const stateCookie = cookies().get('oauth_state')?.value
  if (!stateCookie) throw new Error('Missing state cookie')

  const { from, state } = JSON.parse(stateCookie)

  if (state !== param.state) throw new Error('Invalid state')

  const body = new URLSearchParams()
  body.append('client_id', process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!)
  body.append('client_secret', process.env.NEXT_PUBLIC_SLACK_CLIENT_SECRET!)
  body.append('grant_type', 'authorization_code')
  body.append('code', param.code)
  body.append('redirect_uri', redirect_uri)

  const response = await fetch('https://slack.com/api/oauth.v2.access', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  const result = await response.json()

  if (!result.ok)
    throw new Error('Failed to fetch access token: ' + result.error)

  cookies().delete('oauth_state')
  redirect(from ?? '/')
}