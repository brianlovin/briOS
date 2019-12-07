import styled from 'styled-components'
import defaultTheme from '../Theme'

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: ${defaultTheme.space[4]};
  padding: ${defaultTheme.space[5]} 0 ${defaultTheme.space[2]};

  a {
    display: grid;
    grid-template-columns: ${defaultTheme.space[5]} 1fr;
    grid-gap: ${defaultTheme.space[2]};
    align-items: center;
    font-size: ${defaultTheme.fontSizes[2]};
    font-weight: ${defaultTheme.fontWeights.link};

    svg {
      color: ${props => props.theme.icon.secondary};
    }
  }

  a:hover {
    svg {
      color: ${props => props.theme.icon.primary};
    }
  }

  @media (max-width: ${defaultTheme.breakpoints[5]}) {
    grid-template-columns: 1fr;

    a {
      font-size: ${defaultTheme.fontSizes[1]};
    }
  }
`