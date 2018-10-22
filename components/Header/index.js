// @flow
import * as React from 'react'
import Link from 'next/link'
import { Container, Logo, ButtonRowContainer } from './style'
import { PrimaryButton, GhostButton } from '../Button'

type Props = {
  showHeaderShadow: boolean
}

class Header extends React.Component<Props> {
  render() {
    const { showHeaderShadow } = this.props

    return (
      <Container showHeaderShadow={showHeaderShadow}>
        <Link href={'/'}>
          <a style={{display:'flex',alignItems:'center'}}>
            <Logo>Brian Lovin</Logo>
          </a>
        </Link>

        <ButtonRowContainer>
          <Link href={'/about'}>
            <a>
              <GhostButton>About</GhostButton>
            </a>
          </Link>

          <Link href={'/contact'}>
            <a style={{marginLeft:'8px'}}>
              <PrimaryButton>Contact</PrimaryButton>
            </a>
          </Link>
        </ButtonRowContainer>
      </Container>
    )
  }
}

export default Header