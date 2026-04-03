export interface LegalService {
  id: string
  title: string
  description: string
  icon: string
  /** Lucide icon name used for rendering */
  iconName: 'Landmark' | 'FileText' | 'BarChart3' | 'Scale' | 'Building2'
  features: string[]
  requirements: string[]
  process: string[]
  duration: string
  cost: string
  legalBasis: string[]
  documents: string[]
}

export const legalServices: LegalService[] = [
  {
    id: 'sucesiones-inmobiliarias',
    title: 'Acompañamiento en Sucesiones Inmobiliarias',
    description: 'Coordinamos con abogados y escribanos el proceso sucesorio cuando involucra bienes inmuebles, aportando tasaciones y gestión de la venta posterior.',
    icon: '🏛️',
    iconName: 'Landmark',
    features: [
      'Tasación de inmuebles del acervo hereditario',
      'Coordinación con abogado para el trámite sucesorio',
      'Gestión de la venta de bienes una vez obtenida la declaratoria',
      'Intermediación entre herederos para la venta',
      'Acompañamiento en la inscripción de dominio',
      'Derivación a escribanos y contadores de confianza'
    ],
    requirements: [
      'Declaratoria de herederos (o voluntad de iniciarla)',
      'Datos de los bienes inmuebles involucrados',
      'Acuerdo entre herederos sobre la venta (si corresponde)',
      'Documentación de las propiedades'
    ],
    process: [
      'Consulta inicial para entender la situación',
      'Tasación profesional de los inmuebles involucrados',
      'Derivación al abogado para el trámite judicial',
      'Coordinación con escribano para la transferencia de dominio',
      'Gestión de la comercialización del inmueble si los herederos deciden vender'
    ],
    duration: 'Variable según el trámite judicial',
    cost: 'Consultar - la tasación tiene costo independiente',
    legalBasis: [
      'Ley 20.266 - Martilleros y Corredores (régimen nacional)',
      'Ley 7191 - Ejercicio de Martilleros en Córdoba',
      'Código Civil y Comercial - Libro V, Sucesiones'
    ],
    documents: [
      'Títulos de propiedad de los inmuebles',
      'Partida de defunción del causante',
      'Declaratoria de herederos (si ya se tramitó)',
      'Documentación catastral de las propiedades'
    ]
  },
  {
    id: 'contratos-locacion',
    title: 'Contratos de Locación',
    description: 'Gestionamos contratos de alquiler entre propietarios e inquilinos, conforme a la normativa vigente de locaciones.',
    icon: '📋',
    iconName: 'FileText',
    features: [
      'Redacción de contratos de locación habitacional',
      'Contratos de locación comercial',
      'Gestión de garantías y depósitos',
      'Actualización de valores según índice ICL/IPC',
      'Administración del alquiler durante la vigencia',
      'Mediación ante conflictos entre partes'
    ],
    requirements: [
      'Datos del propietario y del inquilino',
      'Título de propiedad del inmueble',
      'Garantía del inquilino (propietaria, seguro de caución, etc.)',
      'Acuerdo de precio y condiciones entre las partes'
    ],
    process: [
      'Verificación de documentación del propietario e inquilino',
      'Análisis de la garantía presentada',
      'Redacción del contrato conforme a la ley vigente',
      'Firma de las partes y entrega de llaves',
      'Administración mensual (si se contrata)'
    ],
    duration: '3-7 días hábiles',
    cost: 'Según arancel del CPCPI Córdoba',
    legalBasis: [
      'Ley 27.551 - Ley de Alquileres (y modificatorias)',
      'Código Civil y Comercial - Contratos de Locación',
      'Ley 20.266 - Martilleros y Corredores'
    ],
    documents: [
      'DNI de propietario e inquilino',
      'Título de propiedad o autorización del propietario',
      'Documentación de garantía',
      'Recibos de servicios del inmueble'
    ]
  },
  {
    id: 'tasaciones',
    title: 'Tasaciones Profesionales',
    description: 'Valuación objetiva de inmuebles realizada por perito tasador matriculado (MP: 06-1216), válida para trámites judiciales, bancarios y particulares.',
    icon: '📊',
    iconName: 'BarChart3',
    features: [
      'Tasaciones para compraventa',
      'Tasaciones para sucesiones y divorcios',
      'Valuaciones para créditos hipotecarios',
      'Tasaciones para seguros',
      'Informes de valor de mercado',
      'Certificado firmado por perito tasador MP: 06-1216'
    ],
    requirements: [
      'Dirección completa del inmueble',
      'Acceso al inmueble para inspección',
      'Documentación de la propiedad (si está disponible)',
      'Destino de la tasación (judicial, bancario, particular)'
    ],
    process: [
      'Coordinación de visita al inmueble',
      'Inspección y relevamiento técnico',
      'Análisis comparativo de mercado',
      'Elaboración del informe de tasación',
      'Entrega del certificado firmado y sellado'
    ],
    duration: '3-5 días hábiles',
    cost: 'Según arancel del CPCPI Córdoba',
    legalBasis: [
      'Ley 20.266 - Régimen de Martilleros y Corredores',
      'Ley 7191 - Ejercicio profesional en Córdoba',
      'Resoluciones del CPCPI Córdoba'
    ],
    documents: [
      'Escritura o boleto de compraventa',
      'Plano de mensura (si existe)',
      'Impuesto inmobiliario al día',
      'Documentación catastral'
    ]
  },
  {
    id: 'remates-judiciales',
    title: 'Remates Judiciales',
    description: 'Organización y ejecución de subastas judiciales designadas por los tribunales de Córdoba, con total transparencia y respaldo legal.',
    icon: '⚖️',
    iconName: 'Scale',
    features: [
      'Subastas designadas por juzgados',
      'Publicación de edictos en medios oficiales',
      'Exhibición del bien a rematar',
      'Conducción de la subasta pública',
      'Rendición de cuentas al juzgado',
      'Asesoramiento a compradores interesados'
    ],
    requirements: [
      'Designación judicial como martillera',
      'Expediente judicial del remate',
      'Base de subasta fijada por el juzgado',
      'Autorización judicial para publicitar'
    ],
    process: [
      'Recepción de la designación judicial',
      'Publicación de edictos conforme a la ley',
      'Exhibición del inmueble en fecha designada',
      'Realización de la subasta pública',
      'Rendición de cuentas y adjudicación al mejor postor'
    ],
    duration: 'Según plazos judiciales (30-60 días)',
    cost: 'Comisión regulada por ley al comprador',
    legalBasis: [
      'Código Procesal Civil y Comercial de Córdoba',
      'Ley 20.266 - Martilleros y Corredores',
      'Acordadas del Tribunal Superior de Justicia de Córdoba'
    ],
    documents: [
      'Expediente judicial',
      'Auto de subasta del juzgado',
      'Informe de dominio del inmueble',
      'Certificado catastral'
    ]
  },
  {
    id: 'administracion-propiedades',
    title: 'Administración de Propiedades',
    description: 'Gestión integral de propiedades en alquiler: cobro de rentas, mantenimiento, relación con inquilinos y rendición mensual al propietario.',
    icon: '🏠',
    iconName: 'Building2',
    features: [
      'Cobro y seguimiento de alquileres',
      'Gestión de reparaciones y mantenimiento',
      'Rendición mensual de cuentas al propietario',
      'Mediación con inquilinos',
      'Control de vencimientos de contrato',
      'Actualización de valores según índice vigente'
    ],
    requirements: [
      'Contrato de administración firmado',
      'Contrato de locación vigente',
      'Datos del inmueble y del inquilino',
      'Autorización del propietario'
    ],
    process: [
      'Firma del contrato de administración',
      'Relevamiento del estado del inmueble',
      'Gestión mensual de cobros y pagos',
      'Informe mensual al propietario',
      'Gestión de renovación o finalización del contrato'
    ],
    duration: 'Servicio mensual continuo',
    cost: 'Porcentaje sobre el alquiler (según arancel)',
    legalBasis: [
      'Ley 20.266 - Martilleros y Corredores',
      'Ley 27.551 - Ley de Alquileres',
      'Código Civil y Comercial - Mandato'
    ],
    documents: [
      'Contrato de locación vigente',
      'Título de propiedad',
      'DNI del propietario',
      'Datos bancarios para transferencias'
    ]
  }
]

export const getLegalServiceById = (id: string): LegalService | undefined => {
  return legalServices.find(service => service.id === id)
}
