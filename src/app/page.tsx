'use client'

import { openPopup } from './(auth)/oauth/lib/client'

export default function Home() {
  return (
    <main>
      <h1>Home</h1>

      <a
        href="/oauth/slack?callbackType=redirect"
        onClick={(event) => {
          const popup = openPopup('/oauth/slack?callbackType=popup', {
            width: 680,
            height: 640,
          })
          if (popup) event.preventDefault()
        }}
      >
        Sign in with Slack
      </a>
    </main>
  )
}
