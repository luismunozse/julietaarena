export interface LegalService {
  id: string
  title: string
  description: string
  icon: string
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
    id: 'redaccion-contratos',
    title: 'Redacciones de Contratos',
    description: 'Elaboración profesional de contratos civiles y comerciales adaptados a la legislación argentina vigente.',
    icon: '📋',
    features: [
      'Contratos de compraventa inmobiliaria',
      'Contratos de locación residencial y comercial',
      'Contratos de obra y servicios',
      'Contratos de sociedad y asociaciones',
      'Contratos laborales y de prestación de servicios',
      'Contratos de mandato y representación'
    ],
    requirements: [
      'Datos completos de las partes intervinientes',
      'Documentación de identidad vigente',
      'Especificaciones del objeto del contrato',
      'Condiciones comerciales acordadas'
    ],
    process: [
      'Consulta inicial y análisis de necesidades',
      'Recopilación de documentación',
      'Redacción del borrador del contrato',
      'Revisión y ajustes con las partes',
      'Redacción final y entrega del documento'
    ],
    duration: '5-10 días hábiles',
    cost: 'Consultar según complejidad',
    legalBasis: [
      'Código Civil y Comercial de la Nación',
      'Ley de Contrato de Trabajo',
      'Código de Comercio',
      'Jurisprudencia vigente'
    ],
    documents: [
      'DNI de todas las partes',
      'Constancia de CUIT/CUIL si corresponde',
      'Títulos de propiedad (para inmuebles)',
      'Documentación específica del negocio'
    ]
  },
  {
    id: 'declaratoria-herederos',
    title: 'Declaratoria de Herederos',
    description: 'Proceso judicial para establecer la calidad de herederos legítimos según el orden sucesorio establecido en el Código Civil.',
    icon: '👥',
    features: [
      'Tramitación ante Juzgado de Primera Instancia',
      'Citación de herederos presuntos',
      'Publicaciones en medios oficiales',
      'Avalúo de bienes de la herencia',
      'Obtención de declaratoria firme',
      'Asesoramiento en distribución de bienes'
    ],
    requirements: [
      'Partida de defunción del causante',
      'Partidas de nacimiento de herederos',
      'Documentación de parentesco',
      'Inventario de bienes del fallecido'
    ],
    process: [
      'Evaluación de la situación sucesoria',
      'Preparación de la demanda judicial',
      'Presentación ante el Juzgado competente',
      'Seguimiento del expediente',
      'Obtención de la declaratoria firme'
    ],
    duration: '6-12 meses',
    cost: 'Consultar según complejidad del caso',
    legalBasis: [
      'Código Civil y Comercial de la Nación',
      'Ley de Procedimientos Civiles',
      'Jurisprudencia de la Corte Suprema'
    ],
    documents: [
      'Partida de defunción',
      'Partidas de nacimiento de herederos',
      'Documentos que acrediten parentesco',
      'Inventario de bienes',
      'Documentación de propiedades'
    ]
  },
  {
    id: 'sucesiones',
    title: 'Sucesiones',
    description: 'Tramitación completa del proceso sucesorio, incluyendo partición de bienes y transferencias de dominio.',
    icon: '🏛️',
    features: [
      'Tramitación de sucesión testamentaria',
      'Sucesión intestada (sin testamento)',
      'Partición de bienes entre herederos',
      'Transferencia de dominio de inmuebles',
      'Gestión ante organismos públicos',
      'Asesoramiento en derechos sucesorios'
    ],
    requirements: [
      'Declaratoria de herederos firme',
      'Inventario completo de bienes',
      'Avalúos actualizados',
      'Documentación de propiedades'
    ],
    process: [
      'Análisis de la situación sucesoria',
      'Preparación de documentación',
      'Tramitación ante organismos competentes',
      'Gestión de transferencias',
      'Finalización y entrega de títulos'
    ],
    duration: '3-6 meses (post declaratoria)',
    cost: 'Consultar según patrimonio',
    legalBasis: [
      'Código Civil y Comercial de la Nación',
      'Ley de Procedimientos Civiles',
      'Registro de la Propiedad Inmueble',
      'AFIP - Administración Federal de Ingresos Públicos'
    ],
    documents: [
      'Declaratoria de herederos',
      'Inventario de bienes',
      'Avalúos de propiedades',
      'Títulos de dominio',
      'Documentación fiscal'
    ]
  },
  {
    id: 'trato-abreviado',
    title: 'Trato Abreviado',
    description: 'Proceso acelerado para la transmisión de bienes hereditarios, evitando la tramitación judicial completa.',
    icon: '⚡',
    features: [
      'Transmisión directa de bienes',
      'Evita el proceso judicial completo',
      'Reducción significativa de tiempos',
      'Menor costo en honorarios',
      'Aplicable en casos específicos',
      'Gestión ante organismos públicos'
    ],
    requirements: [
      'Acuerdo entre todos los herederos',
      'Bienes de bajo valor económico',
      'Documentación completa de parentesco',
      'Avalúos de los bienes'
    ],
    process: [
      'Evaluación de viabilidad del trato abreviado',
      'Preparación de documentación',
      'Gestión ante organismos competentes',
      'Transferencias de dominio',
      'Finalización del proceso'
    ],
    duration: '1-3 meses',
    cost: 'Consultar según caso',
    legalBasis: [
      'Código Civil y Comercial de la Nación',
      'Registro de la Propiedad Inmueble',
      'Jurisprudencia especializada',
      'AFIP'
    ],
    documents: [
      'Partida de defunción',
      'Partidas de nacimiento',
      'Documentos de parentesco',
      'Inventario de bienes',
      'Avalúos actualizados'
    ]
  },
  {
    id: 'cuota-alimentaria',
    title: 'Cuota Alimentaria',
    description: 'Proceso judicial para la fijación, modificación o ejecución de cuotas alimentarias según las necesidades del alimentario.',
    icon: '🍽️',
    features: [
      'Fijación de cuota alimentaria',
      'Modificación de cuota existente',
      'Ejecución de cuota alimentaria',
      'Índice de actualización automática',
      'Gestión de embargos y medidas cautelares',
      'Asesoramiento en derecho de familia'
    ],
    requirements: [
      'Demostración de necesidad del alimentario',
      'Capacidad económica del alimentante',
      'Documentación de ingresos y gastos',
      'Prueba del vínculo familiar'
    ],
    process: [
      'Evaluación de la situación familiar',
      'Recopilación de documentación probatoria',
      'Preparación de la demanda',
      'Seguimiento del proceso judicial',
      'Obtención de sentencia firme'
    ],
    duration: '3-8 meses',
    cost: 'Consultar según complejidad',
    legalBasis: [
      'Código Civil y Comercial de la Nación',
      'Ley de Procedimientos Civiles',
      'Jurisprudencia de familia',
      'Convención sobre Derechos del Niño'
    ],
    documents: [
      'DNI de las partes',
      'Partida de nacimiento del menor',
      'Constancias de ingresos',
      'Comprobantes de gastos',
      'Documentación médica si corresponde'
    ]
  }
]

export const getLegalServiceById = (id: string): LegalService | undefined => {
  return legalServices.find(service => service.id === id)
}

export const getLegalServicesByCategory = (category: string): LegalService[] => {
  // Esta función puede ser expandida si agregamos categorías
  return legalServices
}
