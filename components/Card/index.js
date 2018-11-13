// @flow
import * as React from 'react';
import { StyledCard } from './style';

type Props = {
  children: React.Node,
  style?: Object,
};

export default function Card(props: Props) {
  const { style, children } = props;
  return <StyledCard style={style}>{children}</StyledCard>;
}
