import { createGlobalStyle, css } from 'styled-components';
import { h1, h2, h3, h4, h5, h6, p, list, listItem, pre, code, blockquote, img } from '~/components/Typography';
import defaultTheme from '~/components/Theme';

const GlobalMarkdownStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Merriweather&display=swap');

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

    img {
      ${img};
    }
  }

  ul, ol {
    ${list};
    font-family: ${defaultTheme.fonts.body};
    line-height: 1.7;
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

  /* ghost's iframe wrapper element, used to add aspect ratio to iframes */
  .kg-embed-card {
    position: relative;
    padding-top: 56.25%;
    margin: ${defaultTheme.space[4]} 0;
    
    iframe {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  hr {
    width: 100%;
    height: 1px;
    background: ${props => props.theme.border.default};
    margin: ${defaultTheme.space[6]} 0;
  }

  table {
    min-width: 100%;
    width: 100%;
    max-width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    margin: ${defaultTheme.space[5]} 0;
    table-layout: fixed;
    white-space: nowrap;

    tbody {
      min-width: 100%;
      display: block;
      overflow: auto;
      width: 100%;
      max-width: 100%;
      width: -webkit-fit-content;
    }

    th {
      ${p};
      font-weight: ${defaultTheme.fontWeights.bold} !important;
      text-align: left;
      padding: ${defaultTheme.space[2]};
    }

    td {
      ${p};
      padding: ${defaultTheme.space[2]};
      vertical-align: top;
      border-top: 1px solid ${props => props.theme.border.default};
      text-overflow: ellipsis;
      width: 100%;
    }

    thead th {
      vertical-align: bottom;
      border-bottom: 1px solid ${props => props.theme.border.default};
    }
  }
`

export default GlobalMarkdownStyles