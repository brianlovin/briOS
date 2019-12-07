import styled from 'styled-components';
import defaultTheme from '~/components/Theme';
import { H6 } from '../Typography';

export const Arrow = styled.div`
  position: absolute;
  transform: translateX(12px);
  bottom: 48px;
  opacity: 0;
  will-change: transform;
  color: #fff;
  transition: transform ${defaultTheme.animations.default}, opacity ${defaultTheme.animations.default};
`

export const Circle = styled.div`
  width: 400px;
  height: 400px;
  border-radius: 50%;
  position: absolute;
  left: -200px;
  bottom: -200px;
  background:${props => props.color};
  transform: scale(0);
  will-change: transform;
  transition: transform ${defaultTheme.animations.default};
`

export const Container = styled.div`
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

  &:hover {

    ${Circle} {
      transform: scale(1);
      transition: transform ${defaultTheme.animations.default};
    }

    ${Arrow} {
      opacity: 1;
      transition: transform ${defaultTheme.animations.hover}, opacity ${defaultTheme.animations.hover};
      transform: translateX(32px);
    }

    video {
      transition: opacity ${defaultTheme.animations.default}, filter ${defaultTheme.animations.default}, transform ${defaultTheme.animations.default};
      transform: rotate3d(.342,-.94,0,22deg) rotateZ(4deg);
      filter: grayscale(0);
      opacity: 1;
    }
  }

  @media (max-width: 968px) {
    height: auto;

    ${Circle} {
      left: 70%;
      right: 0;
      transform: scale(1);
      border-radius: 50%;
      transform: rotateZ(35deg);
    }

    ${Arrow} {
      opacity: 1;
      right: 32px;
      top: 50%;
      height: 32px;
      transform: translateY(-50%);

    }
    
    &:hover {
      ${Arrow} {
        transition: transform ${defaultTheme.animations.hover}, opacity ${defaultTheme.animations.hover};
        transform: translateX(12px) translateY(-50%);
      }
    }
  }
`

export const VideoPlayer = styled.video`
  position: absolute;
  top: 0;
  width: calc(340px);
  top: 30px;
  transform: rotate3d(.342,-.2,0,22deg) rotateZ(7deg);
  z-index: 2;
  transition: ${defaultTheme.animations.hover};
  box-shadow: ${defaultTheme.shadows.largeHover};
  filter: grayscale(1);
  opacity: 0.2;
  min-width: 327px;
  min-height: 600px;
  border-radius: 4px;
  clip-path: padding-box;

  @media (min-width: 1440px) {
    right: -48px;
  }

  @media (max-width: 1440px) {
    right: -24%;
  }

  @media (max-width: 1256px) {
    right: -18%;
  }

  @media (max-width: 1024px) {
    right: -15%;
  }

  @media (max-width: 968px) {
    right: -20px;
  }

  @media (max-width: 968px) {
    display: none;
  }
`

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: center;
  padding: 6px 16px;
  z-index: 3;
`;

export const DetailsCount = styled(H6)`
  color: ${props => props.theme.text.quarternary};
  margin-top: ${defaultTheme.space[1]};
  font-weight: ${defaultTheme.fontWeights.link};
`;

export const Title = styled.p`
  font-size: 18px;
  color: ${props => props.theme.text.primary};
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
`;

export const ImageContainer = styled.span`
  background: transparent;
  width: 56px;
  height: 56px;
  z-index: 1;

  img {
    width: 56px;
    height: 56px;
    border-radius: 12px !important;
    background: ${props => props.theme.bg.primary};
  }
`;

export const Icon = styled.img`
  border-radius: 12px;
  overflow: hidden;
  width: 56px;
  height: 56px;
  user-select: none;
`;
