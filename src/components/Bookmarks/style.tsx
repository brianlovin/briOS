import styled from 'styled-components'
import { p } from '../Typography'

export const Title = styled.p`
  ${p};
  font-weight: 700;
  display: grid;
  align-items: center;
`

export const ListItem = styled.a`
  &:hover {
    ${Title} {
      color: var(--text-link);
    }
  }
`
