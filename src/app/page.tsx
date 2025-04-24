import Script from 'next/script'

export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Welcome to TrustPop 👋</h1>
      <p className="text-gray-600 mt-2">Your dashboard is ready to go.</p>

      {/* Load the popup widget */}
      <Script src="/widget.js" strategy="lazyOnload" />
    </main>
  )
}
  