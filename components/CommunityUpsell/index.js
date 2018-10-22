// @flow
import * as React from 'react'
import Card from '../Card'
import Icon from '../Icon'
import { Container, IconWrapper, Title, Subtitle, Meta } from './style'


class CommunityUpsell extends React.Component<{}> {
  render() {
    return (
      <a href={`https://spectrum.chat/specfm`} target={"_blank"} rel={'noreferrer noopener'}>
        <Card>
          <Container>
            <IconWrapper>
              <Icon glyph="spectrum" size={40} />
            </IconWrapper>
            
            <Meta>
              <Title>Join the community</Title>
              <Subtitle>4,000+ members</Subtitle>
            </Meta>
          </Container>
        </Card>
      </a>
    )
  }
}

export default CommunityUpsell