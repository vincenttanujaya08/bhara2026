// resources/js/components/TransitionLink.jsx
import { useCallback } from 'react'
import { navigateWithTransition } from '../hooks/usePageTransition'

/**
 * Drop-in replacement for Inertia <Link> that adds medieval page transitions.
 * 
 * Usage:
 *   import TransitionLink from '../components/TransitionLink'
 *   <TransitionLink href="/about" style={...}>About</TransitionLink>
 */
export default function TransitionLink({
  href,
  children,
  style,
  className,
  method = 'get',
  as,
  onMouseEnter,
  onMouseLeave,
  onClick,
  ...props
}) {
  const handleClick = useCallback((e) => {
    // Only intercept GET navigation links
    if (method !== 'get' || as === 'button') return

    e.preventDefault()
    onClick?.(e)
    navigateWithTransition(href)
  }, [href, method, as, onClick])

  // For non-GET (forms, logout), render as a regular Inertia link
  if (method !== 'get' || as === 'button') {
    const { Link } = require('@inertiajs/react')
    return (
      <Link
        href={href}
        method={method}
        as={as}
        style={style}
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...props}
      >
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      style={style}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  )
}