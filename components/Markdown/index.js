// @flow
import * as React from 'react';
import { Notes } from './style';

type Props = {
  children: React.Node,
};

function LinkRenderer(props: any) {
  const { href, children } = props;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Markdown(props: Props) {
  const { children } = props;
  return <Notes renderers={{ link: LinkRenderer }}>{children}</Notes>;
}
