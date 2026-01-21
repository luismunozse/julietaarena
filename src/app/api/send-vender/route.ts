import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'martillerajulietaarena@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, telefono, localidad, tipoPropiedad, comentarios } = body

    // Validaciones server-side
    if (!nombre || !email || !telefono || !localidad || !tipoPropiedad) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    // Validar teléfono (10 dígitos)
    const telefonoLimpio = telefono.replace(/\D/g, '')
    if (telefonoLimpio.length !== 10) {
      return NextResponse.json(
        { error: 'El teléfono debe tener 10 dígitos' },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: 'Sitio Web <onboarding@resend.dev>',
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `Nueva solicitud de venta - ${tipoPropiedad} en ${localidad}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 10px;">
            Nueva Solicitud de Venta de Propiedad
          </h2>

          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c5f7d; margin-top: 0;">Datos del Propietario</h3>
            <p style="margin: 10px 0;"><strong>Nombre:</strong> ${nombre}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Teléfono:</strong> <a href="tel:+54${telefonoLimpio}">${telefono}</a></p>
          </div>

          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">Datos de la Propiedad</h3>
            <p style="margin: 10px 0;"><strong>Tipo de propiedad:</strong> ${tipoPropiedad}</p>
            <p style="margin: 10px 0;"><strong>Ubicación:</strong> ${localidad}</p>
          </div>

          ${comentarios ? `
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #c9a227;">
            <h3 style="color: #1a365d; margin-top: 0;">Comentarios adicionales:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${comentarios}</p>
          </div>
          ` : ''}

          <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #155724;">
              <strong>Acción requerida:</strong> Contactar al propietario para coordinar tasación
            </p>
          </div>

          <p style="color: #718096; font-size: 12px; margin-top: 30px; text-align: center;">
            Este mensaje fue enviado desde el formulario de venta de julietaarena.com
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending vender email:', error)
      return NextResponse.json(
        { error: 'Error al enviar el email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error('Error in send-vender route:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
