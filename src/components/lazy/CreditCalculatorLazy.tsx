import dynamic from 'next/dynamic'
import LazyWrapper from '../LazyWrapper'

const CreditCalculator = dynamic(() => import('../CreditCalculator'), {
  loading: () => (
    <LazyWrapper height="600px">
      <div className="skeleton" style={{ height: '600px' }} />
    </LazyWrapper>
  )
})

export default CreditCalculator
