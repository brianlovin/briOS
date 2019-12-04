 import React, { useState, useEffect } from 'react';
import { throttle } from 'throttle-debounce';
import Icon from '../Icon';
import Header from '../Header';
import Footer from '../Footer';
import {
  Container,
  SectionHeading,
  Heading,
  Subheading,
  Paragraph,
  LargeHeading,
  LargeSubheading,
  InnerContainer,
  ContentContainer,
  Rarr,
  Larr,
} from './style';

export {
  SectionHeading,
  Heading,
  Subheading,
  LargeHeading,
  LargeSubheading,
  Paragraph,
  ContentContainer,
  Rarr,
  Larr,
};

interface Props {
  children: React.ReactNode;
  withHeader?: boolean;
};

export default function Page(props: Props) {
  const { children, withHeader = false } = props;
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
      }
    };
  }, []);

  return (
    <Container>
      {withHeader && <Header showHeaderShadow={showHeaderShadow} />}
      <InnerContainer>{children}</InnerContainer>
      <Footer />
    </Container>
  );
}
