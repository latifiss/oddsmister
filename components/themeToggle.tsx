'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const ThemeText = styled.span`
  font-size: 0.875rem;
  color: #4b5563;

  [data-theme='dark'] & {
    color: #9ca3af;
  }
`

const Button = styled.button`
  padding: 0.5rem;
  border-radius: 0.375rem;
  background-color: #e5e7eb;
  transition: background-color 0.2s;

  &:hover {
    background-color: #d1d5db;
  }

  [data-theme='dark'] & {
    background-color: #1f2937;

    &:hover {
      background-color: #374151;
    }
  }
`

export function ThemeToggle() {
  const [mounted, setMounted] = useState<boolean>(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (mounted) {
      console.log('Current theme:', theme)
      console.log('Resolved theme:', resolvedTheme)
      console.log('HTML class:', document.documentElement.className)
    }
  }, [theme, resolvedTheme, mounted])

  if (!mounted) {
    return (
      <Button as="button" aria-label="Theme toggle">
        ●
      </Button>
    )
  }

  return (
    <Container>
      <ThemeText>{resolvedTheme}</ThemeText>
      <Button 
        onClick={() => {
          const next = resolvedTheme === 'light' ? 'dark' : 'light'
          console.log('Setting theme to (resolved):', next)
          setTheme(next)
        }}
        aria-label="Toggle theme"
      >
        {resolvedTheme === 'light' ? '🌙' : '☀️'}
      </Button>
    </Container>
  )
}