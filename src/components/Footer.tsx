import Link from 'next/link'
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const services = [
    { label: 'Venta de Propiedades', href: '/propiedades' },
    { label: 'Alquileres', href: '/propiedades?tipo=alquiler' },
    { label: 'Remates Judiciales', href: '/remates-judiciales' },
    { label: 'Tasaciones', href: '/tasaciones' },
  ]

  const socialLinks = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/share/1FXrZSHSot/',
      icon: Facebook,
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/ajulietamarisel',
      icon: Instagram,
    },
    {
      label: 'LinkedIn',
      href: '#',
      icon: Linkedin,
    },
  ]

  return (
    <footer className="bg-gradient-to-br from-[#1a4158] to-[#2c5f7d] text-white">
      <div className="container mx-auto px-4 pt-12 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pb-10">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Julieta Arena</h3>
            <p className="text-white/90 text-sm">Martillera Pública Matriculada</p>
            <p className="text-white/80 text-sm mt-2 flex items-center justify-center md:justify-start gap-1.5">
              <MapPin className="h-4 w-4" />
              Córdoba, Argentina
            </p>
          </div>

          {/* Services */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 text-[#e8b86d]">Servicios</h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="text-sm text-white/90 hover:text-[#e8b86d] transition-colors inline-block hover:translate-x-1 transform duration-200"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 text-[#e8b86d]">Contacto</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center justify-center md:justify-start gap-2 text-sm text-white/90">
                <Phone className="h-4 w-4 shrink-0" />
                +54 (351) 307-8376
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-sm text-white/90">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">martillerajulietaarena@gmail.com</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-sm text-white/90">
                <Clock className="h-4 w-4 shrink-0" />
                Lun - Vie: 9:00 - 18:00
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 text-[#e8b86d]">Sígueme</h4>
            <div className="flex gap-3 justify-center md:justify-start">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#e8b86d] hover:-translate-y-1 transition-all duration-200 hover:shadow-lg"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 py-6 text-center">
          <p className="text-sm text-white/70">
            &copy; {currentYear} Julieta Arena - Servicios Inmobiliarios. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
