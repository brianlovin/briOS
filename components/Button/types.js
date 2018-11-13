// @flow
import type { Node } from 'react';

export type ButtonSize = 'small' | 'large' | 'default';
export type ButtonProps = {
  size?: ButtonSize,
  disabled?: boolean,
  children: Node | string,
};
