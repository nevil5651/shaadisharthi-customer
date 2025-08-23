import { deleteSession } from '@/lib/session'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Clear the session cookie
    const cookieStore = await cookies()
    cookieStore.delete('session')
    
    // Also call your backend logout if needed
    // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Customer/logout`, {
    //   method: 'POST',
    //   credentials: 'include'
    // })
    
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}