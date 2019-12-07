import React from 'react';
import * as Styled from './style';
import Icon from '~/components/Icon';
import { ButtonProps } from './types';

export default function FacebookButton(props: ButtonProps) {
  const { children } = props;
  return (
    <Styled.FacebookButton {...props}>
      <Icon glyph="facebook" size={24} />
      {children}
    </Styled.FacebookButton>
  );
}
