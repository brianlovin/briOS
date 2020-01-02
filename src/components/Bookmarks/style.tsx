import styled from 'styled-components'
import defaultTheme from '../Theme'
import { p } from '../Typography'

export const Grid = styled.div`
  display: grid;
  max-width: ${defaultTheme.breakpoints[3]};
  margin-top: ${defaultTheme.space[7]};
  grid-gap: ${defaultTheme.space[6]};
  grid-template-columns: 1fr;

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    grid-gap: ${defaultTheme.space[4]};
  }
`


export const Title = styled.p`
  ${p};
  font-size: 1.1rem;
  font-weight: 700;
  display: grid;
  align-items: center;
  grid-gap: ${defaultTheme.space[3]};
  grid-template-columns: 16px 1fr;

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    grid-template-columns: 1fr;

    svg { display: none }
  }
`

export const ListItem = styled.a`
  display: grid;
  grid-gap: ${defaultTheme.space[2]};
  grid-template-columns: 1fr;

  &:hover {
    ${Title} {
      color: ${props => props.theme.text.link};
    }
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    grid-gap: ${defaultTheme.space[1]};
  }
`

export const Url = styled.p`
  ${p};
  font-size: ${defaultTheme.fontSizes[0]};
  margin-top: 0;
  color: ${props => props.theme.text.quarternary};
`