// @flow
// $FlowIssue
import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import { ThemeProvider } from 'styled-components';
import { throttle } from 'throttle-debounce';
import Icon from '../Icon';
import Header from '../Header';
import Footer from '../Footer';
import { theme } from '../theme';
import {
  Container,
  SectionHeading,
  Heading,
  Subheading,
  LargeHeading,
  LargeSubheading,
  InnerContainer,
  ScrollToTop,
} from './style';
import * as gtag from '../../lib/gtag';

export { SectionHeading, Heading, Subheading, LargeHeading, LargeSubheading };

type Props = {
  children: Node,
};

export default function Page(props: Props) {
  const { children } = props;
  const [lastTrackedPageview, setLastTrackedPageview] = useState(null);
  const [showHeaderShadow, setHeaderShadow] = useState(false);
  const [scrollToTopVisible, setScrollToTopVisible] = useState(false);

  function handleScroll() {
    const headerShadowState = window && window.pageYOffset > 0;
    const scrollToTopState = window && window.pageYOffset > 240;
    setHeaderShadow(headerShadowState);
    setScrollToTopVisible(scrollToTopState);
  }

  const throttledScroll = throttle(300, handleScroll);

  const scrollToTop = () => {
    if (window) {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (window) {
      window.addEventListener('scroll', throttledScroll);
    }

    return () => {
      if (window) {
        window.removeEventListener('scroll', throttledScroll);
        setLastTrackedPageview(null);
      }
    };
  }, []);

  useEffect(() => {
    if (document) {
      const newLocation = document.location.pathname;
      if (newLocation !== lastTrackedPageview) {
        gtag.pageview(document.location.pathname);
        setLastTrackedPageview(newLocation);
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header showHeaderShadow={showHeaderShadow} />
        <InnerContainer>{children}</InnerContainer>
        <Footer />
        <ScrollToTop isVisible={scrollToTopVisible} onClick={scrollToTop}>
          <Icon glyph="view-forward" size={32} />
        </ScrollToTop>
      </Container>
    </ThemeProvider>
  );
}
