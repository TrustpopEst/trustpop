'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Event = {
  id: number
  message: string
  created_at: string
  source: string | null
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [message, setMessage] = useState('')
  const [source, setSource] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth/login')
      } else {
        const uid = session.user.id
        setUserId(uid)
        fetchEvents(uid)
      }
    }

    checkSession()
  }, [])

  async function fetchEvents(uid: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })

    if (error) console.error('Error loading events:', error)
    else setEvents(data)
  }

  async function addEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!message || !userId) return

    const { error } = await supabase.from('events').insert([
      {
        message,
        source,
        user_id: userId,
        is_active: true,
      },
    ])

    if (error) {
      console.error('Error adding event:', error)
      return
    }

    setMessage('')
    setSource('')
    fetchEvents(userId)
  }

  async function handleDelete(id: number) {
    const confirmDelete = confirm('Delete this event?')
    if (!confirmDelete || !userId) return

    const { error } = await supabase.from('events').delete().eq('id', id)

    if (error) console.error('Error deleting event:', error)
    else fetchEvents(userId)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">📋 My Events</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
        >
          Logout
        </button>
      </div>

      <form onSubmit={addEvent} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Message (e.g. Booked a call)"
          className="w-full p-2 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Source (optional)"
          className="w-full p-2 border rounded"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Event
        </button>
      </form>

      <ul className="space-y-2">
        {events.map((event) => (
          <li key={event.id} className="border p-3 rounded bg-gray-50 relative">
            <button
              onClick={() => handleDelete(event.id)}
              className="absolute top-1 right-1 text-xs text-red-500 hover:text-red-700"
              title="Delete"
            >
              ✖
            </button>
            <div className="font-medium">{event.message}</div>
            <div className="text-sm text-gray-500">
              {new Date(event.created_at).toLocaleString()}
            </div>
            {event.source && (
              <div className="text-xs italic text-gray-400">Source: {event.source}</div>
            )}
          </li>
        ))}
      </ul>

      {userId && (
        <div className="mt-8 p-4 bg-gray-100 rounded border text-sm text-gray-700">
          <p className="font-medium mb-2">Your Embed Script:</p>
          <div className="relative">
            <code
              id="embed-code"
              className="block bg-white p-2 rounded border overflow-x-auto pr-12"
            >
              {`<script src="https://trustpop.vercel.app/widget.js?user=${userId}" defer></script>`}
            </code>
            <button
              onClick={() => {
                const code = document.getElementById('embed-code')?.innerText
                if (code) {
                  navigator.clipboard.writeText(code)
                  alert('Copied to clipboard ✅')
                }
              }}
              className="absolute top-1 right-1 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </main>
  )
}