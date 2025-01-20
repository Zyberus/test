import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { Contact } from '@/models/Contact'

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      )
    }

    await connectDB()

    const contact = new Contact({
      name,
      email,
      message,
    })

    await contact.save()

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact API Error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
