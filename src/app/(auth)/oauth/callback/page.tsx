import { redirect } from 'next/navigation'
import { callback } from '../lib'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const code = searchParams['code']?.toString()
  const state = searchParams['state']?.toString()

  if (!code) throw new Error('Missing code')
  if (!state) throw new Error('Missing state')

  await callback({ code, state })
}
