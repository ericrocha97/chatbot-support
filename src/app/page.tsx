'use client'
import { DemoDisclaimer } from '@/components/demo-disclaimer'
import { Header } from '@/components/header'
import { AboutSection } from '@/components/sections/about-section'
import { ContactSection } from '@/components/sections/contact-section'
import { DifferentialsSection } from '@/components/sections/differentials-section'
import { ServicesSection } from '@/components/sections/services-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { COMPANY_INFO } from '@/constants/content'
import { ChatSupport } from '@/features/chat/components/chat-support'

export default function Home() {
  return (
    <div className="mx-auto max-w-[800px] flex flex-col gap-6 py-8 px-2 sm:px-4">
      <Header title={COMPANY_INFO.name} />
      <DemoDisclaimer />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
      <DifferentialsSection />
      <ChatSupport />
    </div>
  )
}
