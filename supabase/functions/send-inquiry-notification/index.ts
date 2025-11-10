// Edge Function para enviar notificaciones por email cuando llega una nueva consulta
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'inmobiliaria72juliarena@gmail.com'

interface PropertyInquiry {
  id: string
  created_at: string
  property_id: string
  property_title: string
  property_price: string
  property_location: string
  customer_name: string
  customer_email: string
  customer_phone: string
  message: string
}

interface ContactInquiry {
  id: string
  created_at: string
  customer_name: string
  customer_email: string
  customer_phone: string
  service: string
  message: string
}

serve(async (req) => {
  try {
    const { type, record } = await req.json()

    // Validar que tengamos la API key de Resend
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY no está configurada')
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY no está configurada' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    let emailHtml = ''
    let emailSubject = ''

    // Construir el email según el tipo de consulta
    if (type === 'property_inquiry') {
      const inquiry = record as PropertyInquiry
      emailSubject = `🏠 Nueva Consulta de Propiedad: ${inquiry.property_title}`

      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a4158 0%, #2c5f7d 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">🏠 Nueva Consulta de Propiedad</h1>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1a4158; margin-top: 0;">Información de la Propiedad</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;"><strong>Propiedad:</strong></td>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;">${inquiry.property_title}</td>
              </tr>
              <tr>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;"><strong>Ubicación:</strong></td>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;">${inquiry.property_location}</td>
              </tr>
              <tr>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;"><strong>Precio:</strong></td>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;">${inquiry.property_price}</td>
              </tr>
            </table>

            <h2 style="color: #1a4158;">Información del Cliente</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;"><strong>Nombre:</strong></td>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;">${inquiry.customer_name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;"><strong>Email:</strong></td>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;"><a href="mailto:${inquiry.customer_email}">${inquiry.customer_email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;"><strong>Teléfono:</strong></td>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;"><a href="tel:${inquiry.customer_phone}">${inquiry.customer_phone}</a></td>
              </tr>
            </table>

            <h2 style="color: #1a4158;">Mensaje</h2>
            <div style="padding: 15px; background: white; border: 1px solid #e0e0e0; border-radius: 5px; margin-bottom: 20px;">
              ${inquiry.message}
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://julietaarena.com.ar/admin/consultas"
                 style="display: inline-block; padding: 15px 30px; background: #1a4158; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Ver en el Panel de Administración
              </a>
            </div>

            <div style="margin-top: 30px; padding: 20px; background: #e8f5e9; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #2e7d32;">Acciones Rápidas</h3>
              <p style="margin: 10px 0;">
                <a href="https://wa.me/${inquiry.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${inquiry.customer_name}, te contacto sobre ${inquiry.property_title}`)}"
                   style="color: #25D366; font-weight: bold;">💬 Responder por WhatsApp</a>
              </p>
              <p style="margin: 10px 0;">
                <a href="mailto:${inquiry.customer_email}?subject=${encodeURIComponent(`Consulta sobre ${inquiry.property_title}`)}"
                   style="color: #1a4158; font-weight: bold;">✉️ Responder por Email</a>
              </p>
            </div>
          </div>

          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>Este email fue generado automáticamente por el sistema de consultas de Julieta Arena.</p>
          </div>
        </div>
      `
    } else if (type === 'contact_inquiry') {
      const inquiry = record as ContactInquiry
      const serviceLabels: { [key: string]: string } = {
        'venta': 'Venta de Propiedades',
        'alquiler': 'Alquileres',
        'remate': 'Remates Judiciales',
        'jubilacion': 'Jubilaciones',
        'tasacion': 'Tasaciones',
        'asesoria': 'Asesoramiento Legal',
        'otro': 'Otro'
      }

      emailSubject = `📧 Nuevo Contacto: ${serviceLabels[inquiry.service] || inquiry.service}`

      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a4158 0%, #2c5f7d 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">📧 Nuevo Contacto General</h1>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1a4158; margin-top: 0;">Servicio de Interés</h2>
            <div style="padding: 15px; background: white; border: 1px solid #e0e0e0; border-radius: 5px; margin-bottom: 20px; font-size: 18px; font-weight: bold; color: #1a4158;">
              ${serviceLabels[inquiry.service] || inquiry.service}
            </div>

            <h2 style="color: #1a4158;">Información del Cliente</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;"><strong>Nombre:</strong></td>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;">${inquiry.customer_name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;"><strong>Email:</strong></td>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;"><a href="mailto:${inquiry.customer_email}">${inquiry.customer_email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;"><strong>Teléfono:</strong></td>
                <td style="padding: 10px; background: white; border: 1px solid #e0e0e0;"><a href="tel:${inquiry.customer_phone}">${inquiry.customer_phone}</a></td>
              </tr>
            </table>

            <h2 style="color: #1a4158;">Mensaje</h2>
            <div style="padding: 15px; background: white; border: 1px solid #e0e0e0; border-radius: 5px; margin-bottom: 20px;">
              ${inquiry.message}
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://julietaarena.com.ar/admin/contactos"
                 style="display: inline-block; padding: 15px 30px; background: #1a4158; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Ver en el Panel de Administración
              </a>
            </div>

            <div style="margin-top: 30px; padding: 20px; background: #e8f5e9; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #2e7d32;">Acciones Rápidas</h3>
              <p style="margin: 10px 0;">
                <a href="https://wa.me/${inquiry.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${inquiry.customer_name}, te contacto sobre tu consulta de ${serviceLabels[inquiry.service]}`)}"
                   style="color: #25D366; font-weight: bold;">💬 Responder por WhatsApp</a>
              </p>
              <p style="margin: 10px 0;">
                <a href="mailto:${inquiry.customer_email}?subject=${encodeURIComponent(`Consulta sobre ${serviceLabels[inquiry.service]}`)}"
                   style="color: #1a4158; font-weight: bold;">✉️ Responder por Email</a>
              </p>
            </div>
          </div>

          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>Este email fue generado automáticamente por el sistema de contactos de Julieta Arena.</p>
          </div>
        </div>
      `
    } else {
      throw new Error(`Tipo de consulta desconocido: ${type}`)
    }

    // Enviar el email usando Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Julieta Arena <notificaciones@julietaarena.com.ar>',
        to: [ADMIN_EMAIL],
        subject: emailSubject,
        html: emailHtml,
      }),
    })

    if (!resendResponse.ok) {
      const error = await resendResponse.text()
      console.error('Error de Resend:', error)
      throw new Error(`Error al enviar email: ${error}`)
    }

    const data = await resendResponse.json()
    console.log('Email enviado exitosamente:', data)

    return new Response(
      JSON.stringify({ success: true, emailId: data.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error en la función:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
