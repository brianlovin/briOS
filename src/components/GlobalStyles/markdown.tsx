import { createGlobalStyle, css } from 'styled-components';
import { h1, h2, h3, h4, h5, h6, p, list, listItem, pre, code, blockquote } from '../Typography';
import defaultTheme from '../Theme';

const GlobalMarkdownStyles = createGlobalStyle`
  h1 {
    ${h1};
    margin-top: ${defaultTheme.space[6]};
  }

  h2 {
    ${h2};
    margin-top: ${defaultTheme.space[6]};
  }

  h3 {
    ${h3};
    margin-top: ${defaultTheme.space[6]};
  }

  h4 {
    ${h4};
    margin-top: ${defaultTheme.space[6]};
  }

  h5 {
    ${h5};
    margin-top: ${defaultTheme.space[6]};
  }

  h6 {
    ${h6};
    margin-top: ${defaultTheme.space[6]};
  }

  p {
    ${p};
    margin-top: ${defaultTheme.space[3]};
  }

  ul, ol {
    ${list};
  }

  li {
    ${listItem}
  }

  pre {
    ${pre}
  }

  code {
    ${code}
  }

  strong {
    font-weight: ${defaultTheme.fontWeights.bold};
  }

  blockquote {
    ${blockquote}
  }
`

export default GlobalMarkdownStyles