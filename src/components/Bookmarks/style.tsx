import styled from 'styled-components'
import defaultTheme from '../Theme'
import { p, H5 } from '../Typography'

export const Grid = styled.div`
  display: grid;
  max-width: ${defaultTheme.breakpoints[3]};
  margin-top: ${defaultTheme.space[7]};
  grid-gap: ${defaultTheme.space[6]};
  grid-template-columns: 1fr;

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    margin-top: 0;
  }
`

export const Container = styled.a`
  display: grid;
  grid-gap: ${defaultTheme.space[2]};
  grid-template-columns: 1fr;

  &:hover {
    h5 {
      color: ${props => props.theme.text.link};
    }
  }
`

export const Title = styled(H5)`
  display: flex;
  align-items: center;

  svg {
    margin-right: ${defaultTheme.space[3]};
  }
`

export const Url = styled.p`
  ${p};
  font-size: ${defaultTheme.fontSizes[0]};
  margin-top: 0;
  color: ${props => props.theme.text.quarternary};
`