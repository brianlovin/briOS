import styled from 'styled-components';
import theme from '../theme';

export const Arrow = styled.div`
  position: absolute;
  transform: translateX(12px);
  bottom: 48px;
  opacity: 0;
  will-change: transform;
  color: #fff;
  transition: transform ${theme.animations.default}, opacity ${theme.animations.default};
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
  transition: transform ${theme.animations.default};
`

export const Container = styled.div`
  background: ${props => props.theme.bg.default};
  display: flex;
  position: relative;
  padding: 24px;
  transition: ${theme.animations.default};
  align-items: flex-start;
  height: 400px;
  overflow: hidden;

  &:hover {
    box-shadow: ${theme.shadows.heavyHover};
    transition: box-shadow ${theme.animations.hover};
    z-index: 3;

    ${Circle} {
      transform: scale(1);
      transition: transform ${theme.animations.default};
    }

    ${Arrow} {
      opacity: 1;
      transition: transform ${theme.animations.hover}, opacity ${theme.animations.hover};
      transform: translateX(32px);
    }

    video {
      transition: opacity ${theme.animations.default}, filter ${theme.animations.default}, transform ${theme.animations.default};
      transform: rotate3d(.342,-.94,0,22deg) rotateZ(4deg);
      filter: grayscale(0);
      opacity: 1;
    }
  }
`

export const VideoPlayer = styled.video`
  position: absolute;
  top: 0;
  width: calc(340px);
  right: -20px;
  top: 30px;
  transform: rotate3d(.342,-.2,0,22deg) rotateZ(7deg);
  z-index: 2;
  transition: ${theme.animations.hover};
  box-shadow: ${theme.shadows.hover};
  filter: grayscale(1);
  opacity: 0.2;
  min-width: 327px;
  min-height: 600px;
  border-radius: 4px;

  @media (max-width: 2000px) {
    right: -35%;
  }

  @media (max-width: 1900px) {
    right: -32%;
  }

  @media (max-width: 1800px) {
    right: -30%;
  }

  @media (max-width: 1700px) {
    right: -28%;
  }

  @media (max-width: 1440px) {
    right: -20%;
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

  @media (max-width: 512px) {
    right: -20%;
  }
`

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: center;
  padding: 3px 16px;
  z-index: 5;
`;

export const DetailsCount = styled.p`
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${props => props.theme.text.quarternary};
  margin: 0;
`;

export const Title = styled.p`
  font-size: 18px;
  color: ${props => props.theme.text.default};
  font-weight: 700;
  margin: 0;
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
    background: ${props => props.theme.bg.wash};
  }
`;

export const Icon = styled.img`
  border-radius: 12px;
  overflow: hidden;
  width: 56px;
  height: 56px;
`;
