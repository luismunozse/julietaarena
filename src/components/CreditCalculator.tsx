'use client'

import { useState, useEffect } from 'react'
import styles from './CreditCalculator.module.css'

interface CalculationResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  totalMonths: number
  monthlyInterestRate: number
}

export default function CreditCalculator() {
  const [formData, setFormData] = useState({
    loanAmount: 50000000, // 50 millones de pesos
    interestRate: 12, // 12% anual
    loanTerm: 20, // 20 años
    downPayment: 20, // 20% de enganche
  })

  const [result, setResult] = useState<CalculationResult | null>(null)
  const [showCalculator, setShowCalculator] = useState(false)

  const calculateLoan = () => {
    const principal = formData.loanAmount * (1 - formData.downPayment / 100)
    const monthlyRate = formData.interestRate / 100 / 12
    const totalMonths = formData.loanTerm * 12

    if (monthlyRate === 0) {
      // Si la tasa es 0%, pago mensual es simplemente principal / meses
      const monthlyPayment = principal / totalMonths
      setResult({
        monthlyPayment,
        totalPayment: principal,
        totalInterest: 0,
        totalMonths,
        monthlyInterestRate: 0
      })
      return
    }

    // Fórmula de pago mensual con interés
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
      (Math.pow(1 + monthlyRate, totalMonths) - 1)

    const totalPayment = monthlyPayment * totalMonths
    const totalInterest = totalPayment - principal

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
      totalMonths,
      monthlyInterestRate: monthlyRate
    })
  }

  useEffect(() => {
    calculateLoan()
  }, [formData])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleInputChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <section className={`section ${styles.calculatorSection}`} id="calculadora">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Calculadora de Créditos Hipotecarios</h2>
          <p className="section-subtitle">
            Calcula tu capacidad de pago y simula diferentes escenarios de financiamiento
          </p>
        </div>

        <div className={styles.calculatorContainer}>
          <div className={styles.calculatorCard}>
            <div className={styles.calculatorHeader}>
              <h3>Simulador de Crédito</h3>
              <button
                className={styles.toggleButton}
                onClick={() => setShowCalculator(!showCalculator)}
              >
                {showCalculator ? 'Ocultar' : 'Mostrar'} Calculadora
              </button>
            </div>

            {showCalculator && (
              <div className={styles.calculatorForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="loanAmount">Valor de la Propiedad</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currency}>$</span>
                    <input
                      type="number"
                      id="loanAmount"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
                      min="1000000"
                      step="100000"
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="downPayment">Enganche (%)</label>
                  <div className={styles.rangeContainer}>
                    <input
                      type="range"
                      id="downPayment"
                      min="0"
                      max="50"
                      value={formData.downPayment}
                      onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
                      className={styles.range}
                    />
                    <span className={styles.rangeValue}>{formData.downPayment}%</span>
                  </div>
                  <div className={styles.rangeLabels}>
                    <span>0%</span>
                    <span>50%</span>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="interestRate">Tasa de Interés Anual (%)</label>
                  <div className={styles.rangeContainer}>
                    <input
                      type="range"
                      id="interestRate"
                      min="5"
                      max="25"
                      step="0.5"
                      value={formData.interestRate}
                      onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                      className={styles.range}
                    />
                    <span className={styles.rangeValue}>{formData.interestRate}%</span>
                  </div>
                  <div className={styles.rangeLabels}>
                    <span>5%</span>
                    <span>25%</span>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="loanTerm">Plazo del Crédito (años)</label>
                  <div className={styles.rangeContainer}>
                    <input
                      type="range"
                      id="loanTerm"
                      min="5"
                      max="30"
                      value={formData.loanTerm}
                      onChange={(e) => handleInputChange('loanTerm', Number(e.target.value))}
                      className={styles.range}
                    />
                    <span className={styles.rangeValue}>{formData.loanTerm} años</span>
                  </div>
                  <div className={styles.rangeLabels}>
                    <span>5 años</span>
                    <span>30 años</span>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className={styles.resultsContainer}>
                <div className={styles.resultsGrid}>
                  <div className={styles.resultCard}>
                    <div className={styles.resultIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                      </svg>
                    </div>
                    <div className={styles.resultContent}>
                      <h4>Pago Mensual</h4>
                      <p className={styles.resultAmount}>{formatCurrency(result.monthlyPayment)}</p>
                    </div>
                  </div>

                  <div className={styles.resultCard}>
                    <div className={styles.resultIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div className={styles.resultContent}>
                      <h4>Total a Pagar</h4>
                      <p className={styles.resultAmount}>{formatCurrency(result.totalPayment)}</p>
                    </div>
                  </div>

                  <div className={styles.resultCard}>
                    <div className={styles.resultIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <div className={styles.resultContent}>
                      <h4>Intereses Totales</h4>
                      <p className={styles.resultAmount}>{formatCurrency(result.totalInterest)}</p>
                    </div>
                  </div>

                  <div className={styles.resultCard}>
                    <div className={styles.resultIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div className={styles.resultContent}>
                      <h4>Plazo Total</h4>
                      <p className={styles.resultAmount}>{result.totalMonths} meses</p>
                    </div>
                  </div>
                </div>

                <div className={styles.summaryCard}>
                  <h4>Resumen del Crédito</h4>
                  <div className={styles.summaryContent}>
                    <div className={styles.summaryRow}>
                      <span>Valor de la propiedad:</span>
                      <span>{formatCurrency(formData.loanAmount)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Enganche ({formData.downPayment}%):</span>
                      <span>{formatCurrency(formData.loanAmount * formData.downPayment / 100)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Monto a financiar:</span>
                      <span>{formatCurrency(formData.loanAmount * (1 - formData.downPayment / 100))}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Tasa de interés:</span>
                      <span>{formData.interestRate}% anual</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Plazo:</span>
                      <span>{formData.loanTerm} años</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.calculatorInfo}>
          <div className={styles.infoCard}>
            <h4>💡 Consejos para tu Crédito</h4>
            <ul>
              <li>Un enganche mayor reduce el pago mensual y los intereses totales</li>
              <li>Considera tu capacidad de pago real antes de comprometerte</li>
              <li>Las tasas pueden variar según tu perfil crediticio</li>
              <li>Incluye gastos adicionales como seguros y escrituración</li>
            </ul>
          </div>
          
          <div className={styles.infoCard}>
            <h4>📞 ¿Necesitas Asesoría?</h4>
            <p>Nuestro equipo puede ayudarte a encontrar la mejor opción de financiamiento para tu situación específica.</p>
            <a href="#contacto" className="btn btn-primary">
              Contactar Asesor
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
