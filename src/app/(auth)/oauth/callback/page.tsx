import { redirect } from 'next/navigation'
import { callback } from '../lib'
import { PopupCallback } from '../lib/client'

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
    return <PopupCallback from={from} />
  }
}
