console.log('TrustPop Widget: loading...')

// Grab ?user=xxx from URL
const urlParams = new URLSearchParams(window.location.search)
const userId = urlParams.get('user')

if (!userId) {
  console.error('❌ No user ID in widget script URL')
} else {
  ;(async function () {
    try {
      const res = await fetch(`/api/widget?user=${userId}`)
      const json = await res.json()
      const { events } = json
      if (!events || events.length === 0) return

      const container = document.createElement('div')
      container.style.position = 'fixed'
      container.style.bottom = '20px'
      container.style.left = '20px'
      container.style.background = '#fff'
      container.style.border = '1px solid #ccc'
      container.style.borderRadius = '10px'
      container.style.padding = '12px 16px'
      container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'
      container.style.fontFamily = 'sans-serif'
      container.style.fontSize = '14px'
      container.style.color = '#333'
      container.style.zIndex = '9999'
      container.style.transition = 'all 0.5s ease'
      container.style.opacity = '0'
      container.style.transform = 'translateY(20px)'

      document.body.appendChild(container)

      let index = 0
      function showNext() {
        const event = events[index]
        if (!event) return

        container.style.opacity = '0'
        container.style.transform = 'translateY(20px)'

        setTimeout(() => {
          container.innerText = `${event.message} • ${new Date(event.created_at).toLocaleTimeString()}`
          container.style.opacity = '1'
          container.style.transform = 'translateY(0)'
        }, 300)

        index = (index + 1) % events.length
      }

      showNext()
      const interval = setInterval(showNext, 5000)
      setTimeout(() => {
        clearInterval(interval)
        container.remove()
      }, 30000)
    } catch (err) {
      console.error('❌ TrustPop widget error:', err)
    }
  })()
}