'use client'

export default function Home() {
  return (
    <main>
      <h1>Home</h1>

      <a
        href="/oauth/slack?callbackType=redirect"
        onClick={(event) => {
          const width = 680
          const height = 640
          const left = window.outerWidth / 2 + window.screenX - width / 2
          const top = window.outerHeight / 2 + window.screenY - height / 2
          const popup = window.open(
            '/oauth/slack',
            'oauth-popup',
            `width=${width},height=${height},left=${left},top=${top}`
          )

          if (!popup) return
          event.preventDefault()

          popup.focus()

          const controller = new AbortController()
          const interval = setInterval(() => {
            if (popup.closed) {
              controller.abort()
              clearInterval(interval)
            }
          }, 300)

          window.addEventListener(
            'message',
            (event) => {
              console.log(event)

              if (
                event.origin === window.location.origin &&
                event.data?.type === 'popup-callback'
              ) {
                popup.close()
              }
            },
            { signal: controller.signal }
          )
        }}
      >
        Sign in with Slack
      </a>
    </main>
  )
}
