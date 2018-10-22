// @flow
import * as React from 'react'
import Head from 'next/head'
import Page from '../../components/Page'
import { Container, ContentContainer, PostHeader, Title, } from '../../components/Blog'

class Post extends React.Component<{}> {
  render() {
    return (
      <Page showEmailCapture={false}>

        <Head>
          <title>Brian Lovin · About™</title>
          <meta content={"Brian Lovin · About™"} name="og:title" key="og:title" />
          <meta content={"Nicest not the niciest"} name="og:description" key="og:description" />
          <meta content={"Brian Lovin · About™"} name="twitter:title" key="twitter:title" />
        </Head>

        <Container>
          <ContentContainer style={{paddingTop: '88px'}}>
            <PostHeader>
              <Title>About</Title>
            </PostHeader>

          </ContentContainer>
        </Container>

      </Page>
    )
  }
}

export default Post