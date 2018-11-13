// @flow
import React from 'react';
import * as Styled from './style';
import type { ButtonProps } from './types';

export default function Button(props: ButtonProps) {
  const { children } = props;
  return <Styled.Button {...props}>{children}</Styled.Button>;
}
