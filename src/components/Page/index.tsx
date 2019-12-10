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
  return (
    <PageContainer>
      {withHeader && <Header />}
      <InnerPageContainer role="main">{children}</InnerPageContainer>
    </PageContainer>
  );
}
