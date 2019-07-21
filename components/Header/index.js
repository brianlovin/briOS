// @flow
import * as React from 'react';
import Link from 'next/link';
import Icon from '../Icon';
import { Container, Logo, ButtonRowContainer, Icons } from './style';
import { OutlineButton } from '../Button';

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
        <Icons>
          <a
            href="https://twitter.com/brian_lovin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon glyph="twitter" />
          </a>

          <a
            href="https://github.com/brianlovin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon glyph="github" />
          </a>
        </Icons>
        <Link href="/about">
          <a>
            <OutlineButton>About</OutlineButton>
          </a>
        </Link>
      </ButtonRowContainer>
    </Container>
  );
}
