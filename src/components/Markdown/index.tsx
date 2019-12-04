 
import * as React from 'react';
import { Notes } from './style';

interface Props {
  children: React.ReactNode;
  escapeHtml?: boolean;
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
  const { children, ...rest } = props;
  return <Notes {...rest} renderers={{ link: LinkRenderer }}>{children}</Notes>;
}
