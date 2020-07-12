import React from 'react'
import Header from '~/components/Header'
import {
  PageContainer,
  InnerPageContainer,
  SectionHeading,
  ContentContainer,
} from './style'
import { Footer } from '../Footer'

export { SectionHeading, ContentContainer }

interface Props {
  children: React.ReactNode
}

export default function Page(props: Props) {
  const { children } = props
  return (
    <PageContainer>
      <Header />
      <InnerPageContainer role="main">{children}</InnerPageContainer>
      <Footer />
    </PageContainer>
  )
}
