// @flow
import React from 'react';
import * as Styled from './style';
import Icon from '../Icon';
import type { ButtonProps } from './types';

export default function FacebookButton(props: ButtonProps) {
  const { children } = props;
  return (
    <Styled.FacebookButton {...props}>
      <Icon glyph="facebook" size={24} />
      {children}
    </Styled.FacebookButton>
  );
}
