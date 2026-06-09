import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const TO_EMAIL = 'heonaliu@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: TO_EMAIL,
      replyTo: email,
      subject: subject?.trim() || `New message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#671372;margin-bottom:4px">New message from ${name}</h2>
          <p style="color:#888;font-size:13px;margin-top:0">${email}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <p style="font-size:15px;line-height:1.6;color:#333;white-space:pre-wrap">${message}</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[contact route]', err)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
