// @flow
import * as React from 'react';
import { StyledDismiss } from './style';

type Props = {
  onDismiss: Function,
  color?: Function,
};

export default function Dismiss(props: Props) {
  const { onDismiss, color } = props;

  return (
    <StyledDismiss onClick={onDismiss} tint={color}>
      <i>×</i>
    </StyledDismiss>
  );
}
