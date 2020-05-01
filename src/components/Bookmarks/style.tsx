import styled from 'styled-components'
import theme from '../Theme'
import { p } from '../Typography'

export const Grid = styled.div`
  display: grid;
  width: 100%;
  max-width: ${theme.breakpoints[4]};
  margin-top: ${theme.space[5]};
  grid-gap: ${theme.space[3]};
  grid-template-columns: 1fr;

  @media (max-width: ${theme.breakpoints[4]}) {
    grid-gap: ${theme.space[4]};
  }
`

export const Title = styled.p`
  ${p};
  font-weight: 700;
  display: grid;
  align-items: center;
`

export const ListItem = styled.a`
  display: grid;
  grid-gap: ${theme.space[0]};
  grid-template-columns: 1fr;

  &:hover {
    ${Title} {
      color: var(--text-link);
    }
  }

  @media (max-width: ${theme.breakpoints[4]}) {
    grid-gap: ${theme.space[1]};
  }
`
