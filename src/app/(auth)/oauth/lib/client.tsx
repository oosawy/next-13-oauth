import Script from 'next/script'

export const openPopup = (
  url: string,
  options: { width: number; height: number }
) => {
  const width = options.width
  const height = options.height
  const left = window.outerWidth / 2 + window.screenX - width / 2
  const top = window.outerHeight / 2 + window.screenY - height / 2
  const popup = window.open(
    url,
    'oauth-popup',
    `width=${width},height=${height},left=${left},top=${top}`
  )

  if (!popup) return

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

  return popup
}

export const PopupCallback = ({ from }: { from: string }) => {
  return (
    <Script>{`
      try {
        window.opener.postMessage({ type: "popup-callback" }, location.origin);
      } catch (e) {
        location.href = ${JSON.stringify(from)};
      }
    `}</Script>
  )
}
