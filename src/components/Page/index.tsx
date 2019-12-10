import React from 'react';
import Header from '~/components/Header';
import {
  PageContainer,
  InnerPageContainer,
  SectionHeading,
  ContentContainer,
  ContentGrid,
  PreviewContentGrid,
} from './style';

export {
  SectionHeading,
  ContentContainer,
  ContentGrid,
  PreviewContentGrid
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
