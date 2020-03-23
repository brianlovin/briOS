import styled from 'styled-components'
import defaultTheme from '../Theme'
import { p } from '../Typography'

export const Grid = styled.div`
  display: grid;
  width: 100%;
  max-width: ${defaultTheme.breakpoints[4]};
  margin-top: ${defaultTheme.space[5]};
  grid-gap: ${defaultTheme.space[3]};
  grid-template-columns: 1fr;

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    grid-gap: ${defaultTheme.space[4]};
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
  grid-gap: ${defaultTheme.space[0]};
  grid-template-columns: 1fr;

  &:hover {
    ${Title} {
      color: ${(props) => props.theme.text.link};
    }
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    grid-gap: ${defaultTheme.space[1]};
  }
`
