import React, { useState, useEffect } from 'react';
import { throttle } from 'throttle-debounce';
import Header from '~/components/Header';
import {
  PageContainer,
  InnerPageContainer,
  SectionHeading,
  ContentContainer,
  ContentGrid,
} from './style';

export {
  SectionHeading,
  ContentContainer,
  ContentGrid,
};

interface Props {
  children: React.ReactNode;
  withHeader?: boolean;
};

export default function Page(props: Props) {
  const { children, withHeader = false } = props;
  const [showHeaderShadow, setHeaderShadow] = useState(false);

  function handleScroll() {
    const headerShadowState = window && window.pageYOffset > 0;
    setHeaderShadow(headerShadowState);
  }

  const throttledScroll = throttle(300, handleScroll);


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
    <PageContainer>
      {withHeader && <Header showHeaderShadow={showHeaderShadow} />}
      <InnerPageContainer role="main">{children}</InnerPageContainer>
    </PageContainer>
  );
}
