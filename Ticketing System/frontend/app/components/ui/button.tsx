'use client'
import { cn } from '@/app/lib/utils'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants: Record<string, string> = {
  primary: 'bg-blue-900 text-white hover:bg-blue-800 focus:ring-blue-900',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-400',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
}

const sizes: Record<string, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
}

export function Button({
  variant = 'primary', size = 'md', loading = false,
  className, children, disabled, ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
