import styled from 'styled-components';
import defaultTheme from '~/components/Theme';
import { H6 } from '~/components/Typography'

export const OuterContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  max-width: ${defaultTheme.breakpoints[0]};

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    padding: 0;
  }
`

export const PlayerContainer = styled.div`
  background: ${props => props.theme.bg.secondary};
  border-radius: 10px;
  width: 100%;
  padding: ${defaultTheme.space[4]};
  display: flex;
  margin-top: ${defaultTheme.space[5]};
  align-items: center;

  &:hover {
    box-shadow: ${defaultTheme.shadows.largeHover};
    transition: ${defaultTheme.animations.hover};
  }

  > a {
    min-width: 114px;
    min-height: 114px;
    width: 114px;
    height: 114px;
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: ${defaultTheme.space[1]};

    > a {
      width: 100%;
      height: 100%;
    }
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 200px;
  align-items: center;

  @media (max-width: 440px) {
    margin-top: 8px;
    margin-left: 8px;
    padding-bottom: 8px;
    width: calc(100% - 16px);
    height: 208px;
  }
`;

export const Date = styled(H6)`
  color: ${props => props.theme.text.link};
  margin-top: ${defaultTheme.space[5]};
  font-weight: ${defaultTheme.fontWeights.link};
`;

export const Title = styled.span`
  font-size: ${defaultTheme.fontSizes[4]};
  color: ${props => props.theme.text.primary};
  font-weight: ${defaultTheme.fontWeights.heading};
`;

export const EpisodeCard = styled.div`
  background: ${props => props.theme.bg.secondary};
  display: flex;
  position: relative;
  padding: 24px;
  border-radius: 16px;
  transition: ${defaultTheme.animations.default};
  align-items: flex-start;
  min-height: 300px;
  height: 100%;
  z-index: 3;
  overflow: hidden;
`

export const CardContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto  3fr 1fr;
  grid-gap: ${defaultTheme.space[3]};
  height: 100%;
  position: relative;
  z-index: 2;
`;