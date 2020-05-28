import * as React from 'react'
import styled from 'styled-components'
import Input from '~/components/Input'

export default function Textarea(props) {
  const Input = styled.textarea`
    resize: vertical;
  `
  return <Input as="textarea" {...props} />
}
