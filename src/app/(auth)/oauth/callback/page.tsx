import { redirect } from 'next/navigation'
import { callback } from '../lib'
import Script from 'next/script'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const code = searchParams['code']?.toString()
  const state = searchParams['state']?.toString()

  if (!code) throw new Error('Missing code')
  if (!state) throw new Error('Missing state')

  const { from, callbackType, result } = await callback({ code, state })

  console.log(result)

  if (callbackType === 'redirect') {
    redirect(from)
  }

  if (callbackType === 'popup') {
    return (
      <Script>{`
        try {
          window.opener.postMessage({ type: "popup-callback" });
        } catch (e) {
          location.href = ${JSON.stringify(from)};
        }
      `}</Script>
    )
  }
}
