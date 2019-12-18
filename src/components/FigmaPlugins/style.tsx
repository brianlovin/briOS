import styled from 'styled-components'
import defaultTheme from '~/components/Theme'
import { H6 } from '~/components/Typography'


export const ReadingTime = styled(H6)`
  color: ${props => props.theme.text.link};
  margin-top: ${defaultTheme.space[5]};
  font-weight: ${defaultTheme.fontWeights.link};
`

export const Card = styled.div`
  padding: ${defaultTheme.space[4]};
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr auto;
  position: relative;
  border-radius: 8px;
  background: ${props => props.theme.bg.secondary};
  transition: box-shadow ${props => props.theme.animations.default};

  &:hover {
    ${ReadingTime} {
      color: ${props => props.theme.text.link};
    }
  }

  p {
    margin-top: ${defaultTheme.space[2]};
  }
`

export const PreviewImage = styled.img`
  width: calc(100% + 48px);
  margin-left: -24px;
  margin-top: -24px;
  margin-right: -24px;
  margin-bottom: 20px;
  border-radius: 8px 8px 0 0;
  user-select: none;

  @media (max-width: 768px) {
    margin-left: -24px;
    margin-right: -24px;
    width: calc(100% + 48px);
  }
`