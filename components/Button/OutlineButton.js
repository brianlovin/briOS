// @flow
import React from 'react';
import * as Styled from './style';
import type { ButtonProps } from './types';

export default function OutlineButton(props: ButtonProps) {
  const { children } = props;
  return <Styled.OutlineButton {...props}>{children}</Styled.OutlineButton>;
}
