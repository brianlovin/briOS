 
import * as React from 'react';
import Link from 'next/link'
import htmlParser from 'react-markdown/plugins/html-parser'
import GlobalStyles from '../GlobalStyles';
import { Notes } from './style';

interface Props {
  children: React.ReactNode;
  escapeHtml?: boolean;
};

const parseHtml = htmlParser({
  isValidNode: node => node.type !== 'script',
})

function LinkRenderer(props: any) {
  const { href, children } = props;
  const baseUrl = 'https://brianlovin.com'
  const isSelf = href.indexOf(baseUrl) === 0
  if (isSelf) {
    return <Link href={href === baseUrl ? '/' : href.replace(baseUrl, '')}>
      <a>{children}</a>
    </Link>
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Markdown(props: Props) {
  const { children, ...rest } = props;
  return (
    <React.Fragment>
      <GlobalStyles.MarkdownStyles />
      <Notes 
        {...rest} 
        astPlugins={[ parseHtml ]}
        renderers={{ 
          link: LinkRenderer 
        }}
        >
        {children}
      </Notes>
    </React.Fragment>
  )
}
