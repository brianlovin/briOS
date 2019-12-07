import styled from 'styled-components';
import defaultTheme from '../Theme';

export const Card = styled.div`
  background: ${props => props.theme.bg.secondary};
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
  width: 100%;
  max-width: ${defaultTheme.breakpoints[0]};
  padding: 24px;
  display: flex;
  margin-top: 24px;
  align-items: center;
  position: relative;
  z-index: 2;

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

  @media (max-width: 440px) {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 8px;

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

export const Date = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.tertiary};
`;

export const Title = styled.span`
  font-size: ${defaultTheme.fontSizes[4]};
  color: ${props => props.theme.text.primary};
  font-weight: ${defaultTheme.fontWeights.heading};
`;

export const EpisodeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: ${defaultTheme.space[3]};
  grid-auto-rows: auto;
  width: 100%;
  max-width: ${defaultTheme.breakpoints[0]};
  margin-top: ${defaultTheme.space[5]};

  a {
    border-radius: 16px;
    overflow: hidden;
    will-change: box-shadow;
  }

  a:hover {
    box-shadow: ${defaultTheme.shadows.largeHover};
    transition: box-shadow ${defaultTheme.animations.hover};
  }

  @media (min-width: ${defaultTheme.breakpoints[4]}) {
    padding: 0 ${defaultTheme.space[3]};
  }

  @media (max-width: ${defaultTheme.breakpoints[1]}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${defaultTheme.breakpoints[3]}) {
    grid-template-columns: repeat(1, 1fr);
  }
`

export const EpisodeCard = styled.div`
  background: ${props => props.theme.bg.secondary};
  display: flex;
  position: relative;
  padding: 24px;
  border-radius: 16px;
  transition: ${defaultTheme.animations.default};
  align-items: flex-start;
  height: 400px;
  overflow: hidden;
  z-index: 3;
`

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: center;
  padding: 6px 16px;
  z-index: 3;
`;