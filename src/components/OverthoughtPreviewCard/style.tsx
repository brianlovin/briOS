import styled from 'styled-components'

export const Card = styled.div`
  position: relative;
  background: ${props => props.theme.bg.default};
  padding: 24px;
  border-radius: 16px;
  transition: box-shadow ${props => props.theme.animations.default};

  &:hover {
    box-shadow: ${props => props.theme.shadows.heavyHover};
    transition: box-shadow ${props => props.theme.animations.hover};
    z-index: 2;
  }
`

export const FeaturedImage = styled.img`
  width: calc(100% + 48px);
  min-height: 256px;
  margin-left: -24px;
  margin-top: -24px;
  margin-right: -24px;
  margin-bottom: 20px;
  border-radius: 16px;

  @media (max-width: 768px) {
    width: 100%;
    min-height: 0;
  }
`

export const PreviewImage = styled(FeaturedImage)`
  border-radius: 16px 16px 0 0;

  @media (max-width: 768px) {
    margin-left: -24px;
    margin-right: -24px;
    width: calc(100% + 48px);
  }
`

export const Title = styled.h3`
  font-size: 26px;
  color: ${props => props.theme.text.default};
  font-weight: 700;
  margin: 0;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`

export const ReadingTime = styled.p`
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${props => props.theme.text.quarternary};
  margin: 0;
  margin-top: 16px;
`