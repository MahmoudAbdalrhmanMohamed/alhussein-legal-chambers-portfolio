import { defineEventHandler, readBody, setHeader } from 'resuxjs'

interface InquiryPayload {
  senderName?: string
  senderEmail?: string
  inquiryScope?: string
  message?: string
}

const inquiriesLog: Array<Required<InquiryPayload> & { id: number; createdAt: string }> = []

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return inquiriesLog
  }

  if (event.method === 'POST') {
    const body = (await readBody<InquiryPayload>(event)) || {}
    const senderName = typeof body.senderName === 'string' ? body.senderName.trim() : ''
    const senderEmail = typeof body.senderEmail === 'string' ? body.senderEmail.trim() : ''

    if (!senderName || !senderEmail) {
      return new Response(
        JSON.stringify({ error: 'Both senderName and senderEmail are required.' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      )
    }

    setHeader(event, 'cache-control', 'no-store')
    const entry = {
      id: Date.now(),
      senderName,
      senderEmail,
      inquiryScope: typeof body.inquiryScope === 'string' ? body.inquiryScope : 'General Legal Inquiry',
      message: typeof body.message === 'string' ? body.message.trim() : '',
      createdAt: new Date().toISOString()
    }
    inquiriesLog.push(entry)
    return { ok: true, entry }
  }

  return new Response('Method Not Allowed', { status: 405 })
})
