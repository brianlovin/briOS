import * as React from 'react'
import { Input } from '~/components/Input'

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  style?: any
}

export default function Textarea({ style, ...rest }: Props) {
  return (
    <Input as="textarea" {...rest} style={{ resize: 'vertical', ...style }} />
  )
}
