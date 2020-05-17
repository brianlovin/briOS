import { createGlobalStyle } from 'styled-components'
import {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  list,
  listItem,
  pre,
  code,
  blockquote,
  img,
} from '~/components/Typography'
import theme from '~/components/Theme'

const GlobalMarkdownStyles = createGlobalStyle`
  .markdown {
    h1 {
      ${h1};
      margin-top: ${theme.space[6]};
    }

    h2 {
      ${h2};
      margin-top: ${theme.space[6]};
    }

    h3 {
      ${h3};
      margin-top: ${theme.space[6]};
    }

    h4 {
      ${h4};
      margin-top: ${theme.space[6]};
    }

    h5 {
      ${h5};
      margin-top: ${theme.space[6]};
    }

    h6 {
      ${h6};
      margin-top: ${theme.space[6]};
    }

    p {
      ${p};
      line-height: 1.6;
      margin-top: ${theme.space[3]};
      word-break: break-word;

      &:first-of-type {
        margin-top: 0;
      }

      img {
        ${img};
        margin-top: ${theme.space[3]};
        max-width: 100%;
      }
    }

    figure {
      img {
        ${img};
      }

      margin: ${theme.space[5]} -${theme.space[5]} 0;
      max-width: calc(100% + 64px);

      @media (max-width: ${theme.breakpoints[4]}) {
        max-width: 100%;
        margin: ${theme.space[3]} 0 0;
      }
    }

    ul, ol {
      ${list};
      margin: ${theme.space[3]};
      margin-left: ${theme.space[4]};
      margin-right: 0;
      font-family: ${theme.fonts.body};
      line-height: 1.7;
    }

    li {
      ${listItem}
      margin-top: ${theme.space[3]};
    }

    pre {
      ${pre}
      margin: ${theme.space[5]} 0;
    }

    code {
      ${code}
      margin-top: 0;
    }

    strong {
      font-weight: ${theme.fontWeights.bold};
    }

    blockquote {
      ${blockquote}
      margin-top: ${theme.space[4]};
      margin-bottom: ${theme.space[5]};
    }

    /* ghost's iframe wrapper element, used to add aspect ratio to iframes */
    .kg-embed-card {
      position: relative;
      padding-top: 56.25%;
      margin: ${theme.space[4]} 0;
      
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
      background: var(--border-primary);
      margin: ${theme.space[6]} 0;
    }

    table {
      min-width: 100%;
      width: 100%;
      max-width: 100%;
      border-spacing: 0;
      border-collapse: collapse;
      margin: ${theme.space[5]} 0;
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
        font-weight: ${theme.fontWeights.bold} !important;
        text-align: left;
        padding: ${theme.space[2]};
      }

      td {
        ${p};
        padding: ${theme.space[2]};
        vertical-align: top;
        border-top: 1px solid var(--border-primary);
        text-overflow: ellipsis;
        width: 100%;
      }

      thead th {
        vertical-align: bottom;
        border-bottom: 1px solid var(--border-primary);
      }
    }
  }
`

export default GlobalMarkdownStyles
