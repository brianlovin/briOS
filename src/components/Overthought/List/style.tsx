import styled from 'styled-components'
import defaultTheme from '~/components/Theme'
import { H6 } from '~/components/Typography'

export const ListGrid = styled.div`
  display: grid;
  width: 100%;
  max-width: ${defaultTheme.breakpoints[3]};
  grid-gap: ${defaultTheme.space[4]};
  margin-top: ${defaultTheme.space[5]};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    grid-gap: ${defaultTheme.space[6]};
  }
`

export const PreviewImage = styled.img`
  border-radius: 8px;
  user-select: none;
  width: 100%;
  transition: box-shadow ${defaultTheme.animations.active};
`

export const Card = styled.div`
  display: grid;
  grid-gap: ${defaultTheme.space[4]};
  grid-template-columns: 2fr 3fr;
  grid-template-rows: auto;
  position: relative;
  border-radius: 8px;

  &:hover {
    h4 {
      color: ${props => props.theme.text.link};
    }

    ${PreviewImage} {
      transition: box-shadow ${defaultTheme.animations.hover};
      box-shadow: ${defaultTheme.shadows.largeHover};
    }
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    grid-gap: ${defaultTheme.space[2]};
    grid-template-columns: 1fr;
  }

  p {
    margin-top: ${defaultTheme.space[2]};
  }
`

export const ReadingTime = styled(H6)`
  color: ${props => props.theme.text.quarternary};
  margin-top: ${defaultTheme.space[5]};
  font-weight: ${defaultTheme.fontWeights.link};
  align-self: flex-end;

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    align-self: flex-start;
    margin-top: ${defaultTheme.space[2]};
  }
`

export const Content = styled.div`
  padding: ${defaultTheme.space[4]} 0;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr;
  transition: box-shadow ${defaultTheme.animations.active};

  @media (max-width: ${defaultTheme.breakpoints[3]}) {
    padding-top: 0;
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    padding: ${defaultTheme.space[3]} ${defaultTheme.space[2]} 0;
    grid-template-rows: auto;
  }
`