import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import WhatsAppButton from '@/components/WhatsAppButton'
import EnhancedLiveChat from '@/components/EnhancedLiveChat'
import ComparisonFloatingButton from '@/components/ComparisonFloatingButton'
import NotificationPrompt from '@/components/NotificationPrompt'

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Services />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <WhatsAppButton />
      <EnhancedLiveChat />
      <ComparisonFloatingButton />
      <NotificationPrompt />
    </>
  )
}

