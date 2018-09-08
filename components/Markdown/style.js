// @flow
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'
import { Content } from '../globals'

export const Notes = styled(ReactMarkdown)`
  ${Content}
  max-width: 100%;
  word-break: break-word;
`