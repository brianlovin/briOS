// @flow
import React from 'react';
import * as Styled from './style';
import type { ButtonProps } from './types';

export default function PrimaryButton(props: ButtonProps) {
  const { children } = props;
  return <Styled.PrimaryButton {...props}>{children}</Styled.PrimaryButton>;
}
