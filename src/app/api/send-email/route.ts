import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'martillerajulietaarena@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, service, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const serviceLabels: Record<string, string> = {
      venta: 'Venta de Propiedades',
      alquiler: 'Alquileres',
      remate: 'Remates Judiciales',
      jubilacion: 'Jubilaciones',
      tasacion: 'Tasaciones',
      asesoria: 'Asesoramiento Legal',
      otro: 'Otro',
    }

    const { data, error } = await resend.emails.send({
      from: 'Sitio Web <onboarding@resend.dev>',
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `Nueva consulta de ${name} - ${serviceLabels[service] || service || 'General'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 10px;">
            Nueva Consulta desde el Sitio Web
          </h2>

          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Nombre:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
            <p style="margin: 10px 0;"><strong>Servicio de interés:</strong> ${serviceLabels[service] || service || 'No especificado'}</p>
          </div>

          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #c9a227;">
            <h3 style="color: #1a365d; margin-top: 0;">Mensaje:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>

          <p style="color: #718096; font-size: 12px; margin-top: 30px; text-align: center;">
            Este mensaje fue enviado desde el formulario de contacto de julietaarena.com
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json(
        { error: 'Error al enviar el email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error('Error in send-email route:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
