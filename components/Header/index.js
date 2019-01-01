// @flow
import * as React from 'react';
import Link from 'next/link';
import { Container, Logo, ButtonRowContainer } from './style';
import { PrimaryButton, GhostButton } from '../Button';

type Props = {
  showHeaderShadow: boolean,
};

export default function Header(props: Props) {
  const { showHeaderShadow } = props;

  return (
    <Container showHeaderShadow={showHeaderShadow} data-cy="header">
      <Link href="/">
        <a style={{ display: 'flex', alignItems: 'center' }}>
          <Logo>Brian Lovin</Logo>
        </a>
      </Link>

      <ButtonRowContainer>
        <Link href="/about">
          <a>
            <GhostButton>About</GhostButton>
          </a>
        </Link>

        <Link href="mailto:hi@brianlovin.com">
          <a style={{ marginLeft: '8px' }}>
            <PrimaryButton>Email</PrimaryButton>
          </a>
        </Link>
      </ButtonRowContainer>
    </Container>
  );
}
