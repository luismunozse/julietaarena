import dynamic from 'next/dynamic'
import LazyWrapper from '../LazyWrapper'

const PropertyMap = dynamic(() => import('../PropertyMap'), {
  loading: () => (
    <LazyWrapper height="500px">
      <div className="skeleton" style={{ height: '500px' }} />
    </LazyWrapper>
  )
})

export default PropertyMap
