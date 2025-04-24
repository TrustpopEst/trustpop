import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {

    console.log('SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('SUPABASE KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true) // 👈 only fetch active events
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ events: data })
}