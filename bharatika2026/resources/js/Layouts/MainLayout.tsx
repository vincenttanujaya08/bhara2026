import React, { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { usePage } from '@inertiajs/react'

interface Props {
  children: ReactNode
}

export default function MainLayout({ children }: Props) {
  // Ambil auth langsung dari usePage biar gak perlu oper-oper prop dari parent
  const { auth } = usePage().props as any 

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      background: '#0F0A05' 
    }}>
      {/* Navbar Master - Otomatis dapet data auth dari usePage di dalemnya */}
      <Navbar />

      <main style={{ 
        flex: 1, 
        position: 'relative',
        zIndex: 1 
      }}>
        {children}
      </main>

      <Footer />
    </div>
  )
}