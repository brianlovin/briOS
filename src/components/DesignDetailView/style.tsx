import styled from 'styled-components'
import theme from '~/components/Theme'

export const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 24px 0 0;

  picture > img,
  picture > source {
    box-shadow: ${theme.shadows.default};
    transition: box-shadow ${theme.animations.default};
    border-radius: 16px;
    overflow: hidden;
    width: 64px;
    height: 64px;

    &:hover {
      transition: box-shadow ${theme.animations.hover};
      box-shadow: ${theme.shadows.hover};
    }

    &:active {
      box-shadow: ${theme.shadows.hover};
    }
  }

  @media (max-width: 968px) {
    align-items: flex-start;
    max-width: 100%;
  }
`
