'use client'

import Link from 'next/link'

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return (
    <div>
      <h1>Authentication Error</h1>
      <Link href="/oauth/slack">Retry</Link>
    </div>
  )
}
