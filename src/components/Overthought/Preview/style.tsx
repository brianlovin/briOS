import styled from 'styled-components'
import defaultTheme from '~/components/Theme'
import { H6 } from '~/components/Typography'

export const Card = styled.div`
  padding: ${defaultTheme.space[4]};
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr auto;
  position: relative;
  border-radius: 16px;
  background: ${props => props.theme.bg.secondary};
  transition: box-shadow ${props => props.theme.animations.default};

  p {
    margin-top: ${defaultTheme.space[2]};
  }
`

export const FeaturedImage = styled.img`
  width: calc(100% + 48px);
  min-height: 256px;
  margin-left: -24px;
  margin-top: -24px;
  margin-right: -24px;
  border-radius: 16px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    width: 100%;
    min-height: 0;
    margin: 0;
    margin-top: -24px;
    margin-bottom: 24px;
  }
`

export const PreviewImage = styled.div`
  width: calc(100% + 48px);
  margin-left: -24px;
  margin-top: -24px;
  margin-right: -24px;
  margin-bottom: 20px;
  border-radius: 16px 16px 0 0;
  user-select: none;
  height: 234px;
  background-image: url("${props => props.src}");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;

  @media (max-width: 768px) {
    margin-left: -24px;
    margin-right: -24px;
    width: calc(100% + 48px);
  }
`

export const ReadingTime = styled(H6)`
  color: ${props => props.theme.text.quarternary};
  margin-top: ${defaultTheme.space[5]};
  font-weight: ${defaultTheme.fontWeights.link};
`