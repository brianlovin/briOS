import React from 'react'
import { Container, Spinner } from './style'

interface Props {
  size?: number
}

export default (props: Props) => {
  const { size = 32 } = props
  return (
    <Container>
      <Spinner size={size} />
    </Container>
  )
}
