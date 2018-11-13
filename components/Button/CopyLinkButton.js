// @flow
// $FlowIssue
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import * as Styled from './style';
import Icon from '../Icon';
import type { ButtonProps } from './types';

const Clipboard = dynamic(() => import('react-clipboard.js'), {
  ssr: false,
});

type CopyLinkProps = {
  ...$Exact<ButtonProps>,
  text: string,
};

export default function CopyLinkButton(props: CopyLinkProps) {
  const { text, children } = props;
  const [isClicked, handleClick] = useState(false);

  const onClick = () => {
    handleClick(true);
    setTimeout(() => handleClick(false), 2000);
  };

  return (
    <Clipboard
      style={{ background: 'none' }}
      data-clipboard-text={text}
      onSuccess={onClick}
      component="a"
    >
      <Styled.CopyLinkButton
        data-cy="copy-link-button"
        isClicked={isClicked}
        {...props}
      >
        <Icon glyph="link" size={24} />
        {isClicked ? 'Copied!' : children}
      </Styled.CopyLinkButton>
    </Clipboard>
  );
}
