import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Heona Liu.',
}

export default function ContactPage() {
  return <ContactClient />
}
