import * as React from 'react';
import { StyledDismiss } from './style';

interface Props {
  onDismiss: Function;
  color?: Function;
  children: React.ReactNode | string;
};

export default function Dismiss(props: Props) {
  const { onDismiss, color } = props;

  return (
    <StyledDismiss onClick={onDismiss} tint={color}>
      <i>×</i>
    </StyledDismiss>
  );
}
