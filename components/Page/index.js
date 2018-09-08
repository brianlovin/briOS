// @flow
import * as React from 'react'
import { ThemeProvider } from 'styled-components'
import Icon from '../Icon'
import Header from '../Header'
import Footer from '../Footer'
import { theme } from '../theme'
import { Container, SectionHeading, Heading, Subheading, InnerContainer, ScrollToTop } from './style'
import { throttle } from 'throttle-debounce';
import * as gtag from '../../lib/gtag'

export { SectionHeading, Heading, Subheading }

type Props = {
  children: React.Node,
  showEmailCapture?: boolean,
  dataCy?: string,
}

type State = {
  showHeaderShadow: boolean,
  scrollToTopVisible: boolean,
}


export default class Page extends React.Component<Props, State> {
  lastTrackedPageview: ?string;

  constructor() {
    super()

    this.state = { showHeaderShadow: false, scrollToTopVisible: false }
    this.handleScroll = throttle(300, this.handleScroll)
    this.lastTrackedPageview = null
  }

  componentDidMount() {
    window && window.addEventListener('scroll', this.handleScroll);
    
    if (document) {
      gtag.pageview(document.location.pathname)
      this.lastTrackedPageview = document.location.pathname
    }
  }

  componentWillUnmount() {
    window && window.removeEventListener('scroll', this.handleScroll);
    this.lastTrackedPageview = null
  }

  componentDidUpdate() {
    if (document) {
      const newLocation = document.location.pathname
      if (newLocation !== this.lastTrackedPageview) {
        gtag.pageview(document.location.pathname)
        this.lastTrackedPageview = newLocation
      }
    }
  }

  handleScroll = () => {
    const showHeaderShadow = window && window.pageYOffset > 0
    const scrollToTopVisible = window && window.pageYOffset > 240
    return this.setState({ showHeaderShadow, scrollToTopVisible })
  }

  scrollToTop = () => {
    return window && window.scrollTo(0, 0)
  }

  render() {
    const { showHeaderShadow, scrollToTopVisible } = this.state

    return (
      <ThemeProvider theme={theme}>
        <Container>
          <Header showHeaderShadow={showHeaderShadow}/>
          
          <InnerContainer>
            {this.props.children}
          </InnerContainer>
          
          <Footer />
          
          <ScrollToTop 
            isVisible={scrollToTopVisible} 
            onClick={this.scrollToTop}
          >
            <Icon glyph={'view-forward'} size={32} />
          </ScrollToTop>

        </Container>
      </ThemeProvider>
    )
  }
}