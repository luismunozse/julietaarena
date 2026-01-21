import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'martillerajulietaarena@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      clientName,
      clientEmail,
      clientPhone,
      propertyTitle,
      propertyId,
      date,
      time,
      notes
    } = body

    // Validaciones server-side
    if (!clientName || !clientEmail || !clientPhone || !propertyTitle || !date || !time) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(clientEmail)) {
      return NextResponse.json(
        { error: 'Formato de email invalido' },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: 'Sitio Web <onboarding@resend.dev>',
      to: [CONTACT_EMAIL],
      replyTo: clientEmail,
      subject: `Nueva cita agendada - ${propertyTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 10px;">
            Nueva Cita Agendada
          </h2>

          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #155724; margin-top: 0;">Fecha y Hora</h3>
            <p style="margin: 10px 0; font-size: 18px;"><strong>${date}</strong> a las <strong>${time}</strong></p>
          </div>

          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c5f7d; margin-top: 0;">Datos del Cliente</h3>
            <p style="margin: 10px 0;"><strong>Nombre:</strong> ${clientName}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${clientEmail}">${clientEmail}</a></p>
            <p style="margin: 10px 0;"><strong>Telefono:</strong> <a href="tel:${clientPhone}">${clientPhone}</a></p>
          </div>

          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">Propiedad</h3>
            <p style="margin: 10px 0;"><strong>Titulo:</strong> ${propertyTitle}</p>
            <p style="margin: 10px 0;"><strong>ID:</strong> ${propertyId}</p>
          </div>

          ${notes ? `
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #c9a227;">
            <h3 style="color: #1a365d; margin-top: 0;">Notas adicionales:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${notes}</p>
          </div>
          ` : ''}

          <p style="color: #718096; font-size: 12px; margin-top: 30px; text-align: center;">
            Este mensaje fue enviado desde el formulario de citas de julietaarena.com
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending appointment email:', error)
      return NextResponse.json(
        { error: 'Error al enviar el email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error('Error in send-appointment route:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
