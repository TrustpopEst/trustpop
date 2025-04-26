// public/widget.js
console.log('TrustPop Widget: loading...');

// Find this current <script> tag to extract the `user` query param
const currentScript = document.currentScript || (function() {
  const scripts = document.getElementsByTagName('script');
  return scripts[scripts.length - 1];
})();
const scriptSrc = currentScript && currentScript.src;

console.log('Script src:', scriptSrc);

// Parse out the user ID from the script URL
let userId = null;
if (scriptSrc) {
  try {
    const url = new URL(scriptSrc);
    userId = url.searchParams.get('user');
  } catch (err) {
    console.error('❌ Invalid widget script URL:', err);
  }
}
console.log('User ID from script:', userId);

if (!userId) {
  console.error('❌ No user ID in widget script URL');
} else {
  ;(async () => {
    console.log(`⏳ Fetching data from API with user: ${userId}`);
    try {
      const res = await fetch(`/api/widget?user=${encodeURIComponent(userId)}`);
      const json = await res.json();
      console.log('✅ API response:', json);
      const { events } = json;
      if (!events || events.length === 0) {
        console.log('❌ No events to display');
        return;
      }

      // Create and style the pop-up container
      const container = document.createElement('div');
      Object.assign(container.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '12px 16px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#333',
        zIndex: '9999',
        transition: 'all 0.5s ease',
        opacity: '0',
        transform: 'translateY(20px)',
      });
      document.body.appendChild(container);

      let index = 0;
      function showNext() {
        const ev = events[index];
        if (!ev) return;

        // hide
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';

        setTimeout(() => {
          container.textContent = `${ev.message} • ${new Date(ev.created_at).toLocaleTimeString()}`;
          container.style.opacity = '1';
          container.style.transform = 'translateY(0)';
        }, 300);

        index = (index + 1) % events.length;
      }

      showNext();
      const interval = setInterval(showNext, 5000);
      setTimeout(() => {
        clearInterval(interval);
        container.remove();
      }, 30000);
    } catch (err) {
      console.error('❌ TrustPop widget error:', err);
    }
  })();
}