import React from 'react'
import { TruncatedTextProps } from '@/types'

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  className = '',
  maxLength,
  maxWidth = 'max-w-[200px]',
  withTooltip = true,
  fontSize = 'base',
  as: Component = 'span',
}) => {
  const truncatedText = maxLength
    ? text.slice(0, maxLength) + (text.length > maxLength ? '...' : '')
    : text
  const baseClasses = `truncate ${maxWidth} ${`text-${fontSize}`}`
  const combinedClasses = `${baseClasses} ${className}`.trim()

  return (
    <Component className={combinedClasses} title={withTooltip ? text : undefined}>
      {truncatedText}
    </Component>
  )
}

export default TruncatedText
