'use client'

import { useState, useEffect, useCallback } from 'react'
import { DollarSign, ArrowRightLeft, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'

interface DolarRate {
  compra: number
  venta: number
  fechaActualizacion: string
}

interface UsdCalculatorProps {
  /** Precio de la propiedad */
  price: number
  /** Moneda original */
  currency: 'ARS' | 'USD'
}

export default function UsdCalculator({ price, currency }: UsdCalculatorProps) {
  const [rate, setRate] = useState<DolarRate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [direction, setDirection] = useState<'USD_ARS' | 'ARS_USD'>(
    currency === 'USD' ? 'USD_ARS' : 'ARS_USD'
  )

  const fetchRate = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('https://dolarapi.com/v1/dolares/blue', {
        next: { revalidate: 3600 },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      const data: DolarRate = await res.json()
      setRate(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRate()
  }, [fetchRate])

  const toggleDirection = () => {
    setDirection((d) => (d === 'USD_ARS' ? 'ARS_USD' : 'USD_ARS'))
  }

  const formatNumber = (n: number, curr: 'ARS' | 'USD') => {
    if (curr === 'USD') {
      return `USD ${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(n)}`
    }
    return `$ ${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(n)}`
  }

  const getConvertedPrice = (): { from: string; to: string; rateUsed: number } | null => {
    if (!rate) return null

    if (currency === 'USD') {
      // La propiedad está en USD
      if (direction === 'USD_ARS') {
        return {
          from: formatNumber(price, 'USD'),
          to: formatNumber(price * rate.venta, 'ARS'),
          rateUsed: rate.venta,
        }
      } else {
        return {
          from: formatNumber(price, 'USD'),
          to: formatNumber(price, 'USD'),
          rateUsed: rate.venta,
        }
      }
    } else {
      // La propiedad está en ARS
      if (direction === 'ARS_USD') {
        return {
          from: formatNumber(price, 'ARS'),
          to: formatNumber(price / rate.venta, 'USD'),
          rateUsed: rate.venta,
        }
      } else {
        return {
          from: formatNumber(price, 'ARS'),
          to: formatNumber(price, 'ARS'),
          rateUsed: rate.venta,
        }
      }
    }
  }

  const converted = getConvertedPrice()

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ''
    }
  }

  // No mostrar si la conversión no tiene sentido (misma moneda sin toggle)
  const showConversion =
    (currency === 'USD' && direction === 'USD_ARS') ||
    (currency === 'ARS' && direction === 'ARS_USD')

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-sm font-semibold text-foreground">Calculadora USD</span>
        </div>
        <button
          onClick={fetchRate}
          disabled={loading}
          className="p-1.5 rounded-md hover:bg-white/60 transition-colors disabled:opacity-40"
          title="Actualizar cotizaci&oacute;n"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-muted ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-4">
        {loading && !rate ? (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="w-5 h-5 text-muted animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-3">
            <p className="text-xs text-muted mb-2">No se pudo obtener la cotizaci&oacute;n</p>
            <button
              onClick={fetchRate}
              className="text-xs text-brand-primary hover:underline font-medium"
            >
              Reintentar
            </button>
          </div>
        ) : rate && converted ? (
          <>
            {/* Cotización */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted font-medium mb-0.5">
                  D&oacute;lar Blue
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-foreground">
                    $ {new Intl.NumberFormat('es-AR').format(rate.venta)}
                  </span>
                  <span className="text-[10px] text-muted">venta</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-2 justify-end">
                  <span className="text-sm font-semibold text-muted">
                    $ {new Intl.NumberFormat('es-AR').format(rate.compra)}
                  </span>
                  <span className="text-[10px] text-muted">compra</span>
                </div>
              </div>
            </div>

            {/* Conversión */}
            {showConversion && (
              <div className="bg-surface rounded-lg p-3 mb-3">
                <p className="text-[10px] uppercase tracking-wider text-muted font-medium mb-1.5">
                  Precio estimado
                </p>
                <p className="text-xl font-bold text-brand-primary">{converted.to}</p>
                <p className="text-xs text-muted mt-1">
                  {currency === 'USD' ? 'Equivalente en pesos argentinos' : 'Equivalente en d\u00f3lares'}
                </p>
              </div>
            )}

            {/* Toggle */}
            <button
              onClick={toggleDirection}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-border hover:bg-surface text-xs font-medium text-muted hover:text-foreground transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              {showConversion
                ? `Ver en ${currency === 'USD' ? 'USD' : 'ARS'}`
                : `Convertir a ${currency === 'USD' ? 'ARS' : 'USD'}`}
            </button>

            {/* Timestamp */}
            {rate.fechaActualizacion && (
              <p className="text-[10px] text-center text-muted/60 mt-2.5">
                Actualizado: {formatDate(rate.fechaActualizacion)}
              </p>
            )}
          </>
        ) : null}
      </div>

      {/* Disclaimer */}
      <div className="px-4 pb-3">
        <p className="text-[9px] text-muted/50 leading-relaxed">
          * Cotizaci&oacute;n referencial del d&oacute;lar blue. Los valores son orientativos y pueden variar.
        </p>
      </div>
    </div>
  )
}
