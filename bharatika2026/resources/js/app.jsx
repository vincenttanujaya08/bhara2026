// resources/js/app.jsx
import './bootstrap'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import '../css/app.css'
import { setupTransitions, injectTransitionStyles } from './hooks/usePageTransition'

// Inject styles immediately
injectTransitionStyles()

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./pages/**/*.jsx', { eager: true })
    return pages[`./pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)

    // Setup transition system after mount
    requestAnimationFrame(() => {
      setupTransitions()
    })
  },
})