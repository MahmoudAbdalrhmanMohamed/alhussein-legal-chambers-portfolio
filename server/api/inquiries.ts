import { defineEventHandler, readBody, setHeader } from 'resuxjs'

export const LAWYER_EMAIL = 'hm8550845@gmail.com'

interface InquiryPayload {
  senderName?: string
  senderEmail?: string
  senderPhone?: string
  inquiryScope?: string
  scopeId?: string
  message?: string
  attachment?: {
    name: string
    size: number
    type: string
    data: string // base64
  }
}

interface InquiryRecord {
  id: number
  senderName: string
  senderEmail: string
  senderPhone?: string
  inquiryScope: string
  message: string
  attachment?: {
    name: string
    size: number
    type: string
  }
  createdAt: string
  emailDispatched?: boolean
}

const inquiriesLog: InquiryRecord[] = []

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return inquiriesLog
  }

  if (event.method === 'POST') {
    const body = (await readBody<InquiryPayload>(event)) || {}
    const senderName = typeof body.senderName === 'string' ? body.senderName.trim() : ''
    const senderEmail = typeof body.senderEmail === 'string' ? body.senderEmail.trim() : ''
    const senderPhone = typeof body.senderPhone === 'string' ? body.senderPhone.trim() : ''
    const inquiryScope = typeof body.inquiryScope === 'string' ? body.inquiryScope.trim() : 'General Legal Inquiry'
    const message = typeof body.message === 'string' ? body.message.trim() : ''

    if (!senderName || !senderEmail || !message) {
      return new Response(
        JSON.stringify({
          error: 'حقول الاسم والبريد الإلكتروني وتفاصيل الرسالة مطلوبة جميعاً / Name, email, and message are required.'
        }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(senderEmail)) {
      return new Response(
        JSON.stringify({ error: 'صيغة البريد الإلكتروني غير صحيحة / Invalid email address.' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      )
    }

    setHeader(event, 'cache-control', 'no-store')

    const hasAttachment = Boolean(body.attachment && body.attachment.name && body.attachment.data)
    const attachmentInfo = hasAttachment && body.attachment
      ? {
          name: body.attachment.name,
          size: body.attachment.size || 0,
          type: body.attachment.type || 'application/octet-stream'
        }
      : undefined

    const entry: InquiryRecord = {
      id: Date.now(),
      senderName,
      senderEmail,
      senderPhone: senderPhone || undefined,
      inquiryScope,
      message,
      attachment: attachmentInfo,
      createdAt: new Date().toISOString()
    }

    // Attempt to dispatch email via Resend if RESEND_API_KEY is configured
    let emailSent = false
    const ENV = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env || {}
    const resendApiKey = ENV.RESEND_API_KEY
    const targetRecipient = ENV.CHAMBERS_NOTIFICATION_EMAIL || LAWYER_EMAIL

    if (resendApiKey) {
      try {
        const fromEmail = ENV.RESEND_FROM || 'Al Hussein Legal Chambers <onboarding@resend.dev>'
        const emailSubject = `[استفسار وتكليف قانوني جديد] ${inquiryScope} — من: ${senderName}`

        const htmlBody = `
          <div dir="rtl" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
            <div style="border-bottom: 2px solid #1B365D; padding-bottom: 16px; margin-bottom: 20px;">
              <span style="font-size: 12px; font-weight: bold; color: #1B365D; text-transform: uppercase; letter-spacing: 1px;">المكتب القانوني الرسمي — إشعار استفسار وتكليف جديد</span>
              <h2 style="margin: 8px 0 0 0; color: #0f172a; font-size: 22px;">الأستاذ الحسين محمد عبدالله</h2>
            </div>
            
            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
              تلقيت رسالة وتكليفاً قانونياً جديداً عبر النموذج الإلكتروني لموقعك:
            </p>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold; color: #64748b; width: 140px;">اسم الراسل / الجهة:</td>
                <td style="padding: 10px 0; font-weight: 600; color: #0f172a;">${escapeHtml(senderName)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold; color: #64748b;">البريد الإلكتروني:</td>
                <td style="padding: 10px 0;"><a href="mailto:${escapeHtml(senderEmail)}" style="color: #1B365D; text-decoration: underline;">${escapeHtml(senderEmail)}</a></td>
              </tr>
              ${senderPhone ? `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold; color: #64748b;">رقم الهاتف / واتساب:</td>
                <td style="padding: 10px 0; font-weight: 600; color: #0f172a;" dir="ltr"><a href="tel:${escapeHtml(senderPhone)}" style="color: #1B365D;">${escapeHtml(senderPhone)}</a></td>
              </tr>
              ` : ''}
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold; color: #64748b;">القطاع / نوع التكليف:</td>
                <td style="padding: 10px 0; font-weight: 600; color: #0f172a;">${escapeHtml(inquiryScope)}</td>
              </tr>
              ${hasAttachment && body.attachment ? `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold; color: #64748b;">الملف المرفق:</td>
                <td style="padding: 10px 0; font-weight: 600; color: #0f172a;">📎 ${escapeHtml(body.attachment.name)} (${formatFileSize(body.attachment.size)})</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #64748b;">تاريخ الإرسال:</td>
                <td style="padding: 10px 0; color: #475569;" dir="ltr">${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}</td>
              </tr>
            </table>

            <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
              <div style="font-size: 13px; font-weight: bold; color: #64748b; margin-bottom: 8px;">نص الرسالة والتفاصيل:</div>
              <div style="font-size: 14px; line-height: 1.8; color: #1e293b; white-space: pre-wrap;">${escapeHtml(message)}</div>
            </div>

            <div style="text-align: center; margin-bottom: 20px;">
              <a href="mailto:${escapeHtml(senderEmail)}?subject=${encodeURIComponent('رد بخصوص استفسارك القانوني — الأستاذ الحسين محمد عبدالله')}" style="display: inline-block; background-color: #1B365D; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 6px;">
                الرد المباشر على الراسل عبر البريد الإلكتروني
              </a>
            </div>

            <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #94a3b8; text-align: center;">
              تم إرسال هذا الإشعار تلقائياً من الموقع الرسمي للأستاذ الحسين محمد عبدالله — باحث قانوني ومحامٍ مقيد بنقابة المحامين المصرية.
            </div>
          </div>
        `

        const attachments = hasAttachment && body.attachment
          ? [
              {
                filename: body.attachment.name,
                content: body.attachment.data
              }
            ]
          : undefined

        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [targetRecipient],
            reply_to: senderEmail,
            subject: emailSubject,
            html: htmlBody,
            attachments
          })
        })

        if (resendResponse.ok) {
          emailSent = true
        } else {
          const resendErr = await resendResponse.text().catch(() => '')
          console.warn('[Resend API Warning]', resendResponse.status, resendErr)
        }
      } catch (dispatchErr) {
        console.error('[Email Dispatch Error]', dispatchErr)
      }
    } else {
      // In development or when RESEND_API_KEY is not supplied in environment:
      // We log the inquiry cleanly so no customer data is ever lost
      console.info(`[Chambers Legal Inquiry Registered]`, {
        to: targetRecipient,
        from: senderEmail,
        name: senderName,
        phone: senderPhone,
        scope: inquiryScope,
        attachment: hasAttachment ? body.attachment?.name : 'none',
        date: entry.createdAt
      })
    }

    entry.emailDispatched = emailSent
    inquiriesLog.push(entry)

    return {
      ok: true,
      emailSent,
      recipient: targetRecipient,
      entry: {
        id: entry.id,
        senderName: entry.senderName,
        senderEmail: entry.senderEmail,
        senderPhone: entry.senderPhone,
        inquiryScope: entry.inquiryScope,
        attachment: entry.attachment,
        createdAt: entry.createdAt
      }
    }
  }

  return new Response('Method Not Allowed', { status: 405 })
})

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}
