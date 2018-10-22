// @flow
import * as React from 'react'
import { Container, Description, Icons } from './style'
import Icon from '../Icon'
import GlobalPlayer from '../GlobalPlayer/context'

class Footer extends React.Component<{}> {
  render() {
    return (
      <GlobalPlayer.Consumer>

        {
          context => (
            <Container addPlayerPadding={context.trackQueue.length > 0}>
              <Icons>
                <a href="https://twitter.com/brian_lovin" target="_blank" rel="noopener noreferrer">
                  <Icon glyph={'twitter'} />
                </a>
                
                <a href="https://github.com/brianlovin/brian-lovin-next" target="_blank" rel="noopener noreferrer">
                  <Icon glyph={'github'} />
                </a>

                <a href="https://spectrum.chat/users/brian" target="_blank" rel="noopener noreferrer">
                  <Icon glyph={'spectrum-solid'} />
                </a>
              </Icons>
              
              <Description>
                Copyright whenever. This is <a href="https://github.com/brianlovin/brian-lovin-next" target="_blank" rel="noopener noreferrer">open source</a>.
              </Description>
            </Container>
         )
        }
      </GlobalPlayer.Consumer>
    )
  }
}

export default Footer