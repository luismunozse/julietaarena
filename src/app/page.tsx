import nextDynamic from 'next/dynamic'
import Hero from '@/components/Hero'
import AnimateOnScroll from '@/components/AnimateOnScroll'

export const dynamic = 'force-static'

const Services = nextDynamic(() => import('@/components/Services'))
const About = nextDynamic(() => import('@/components/About'))
const Testimonials = nextDynamic(() => import('@/components/Testimonials'))
const Contact = nextDynamic(() => import('@/components/Contact'))
const WhatsAppButton = nextDynamic(() => import('@/components/WhatsAppButton'))
const ComparisonFloatingButton = nextDynamic(() => import('@/components/ComparisonFloatingButton'))
const NotificationPrompt = nextDynamic(() => import('@/components/NotificationPrompt'))

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <AnimateOnScroll>
          <Services />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <About />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Testimonials />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Contact />
        </AnimateOnScroll>
      </main>
      <WhatsAppButton />
      <ComparisonFloatingButton />
      <NotificationPrompt />
    </>
  )
}
