import type { Metadata } from 'next'
import { getPageHeaderOverrides } from '@/lib/page-content-firestore'
import ContactClient from './ContactClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Heona Liu.',
}

export default async function ContactPage() {
  const headerOverrides = await getPageHeaderOverrides()
  return <ContactClient headerOverride={headerOverrides.contact} />
}
