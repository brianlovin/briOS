 
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

export const Notes = styled(ReactMarkdown)`
  max-width: 100%;
  word-break: break-word;

  p:first-of-type {
    margin-top: 0;
  }
`;
