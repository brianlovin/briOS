 
import * as React from 'react';
import Link from 'next/link';
import Page, { SectionHeading, Subheading, ContentContainer, Rarr, LargeHeading, Larr } from '../../components/Page';
import OverthoughtGrid from '../../components/OverthoughtGrid'
import { getPosts } from '../../data/ghost'
import { BlogPost } from '../../types'

interface Props {
  posts?: Array<BlogPost>
}

function Overthought({ posts }: Props) {
  return (
    <Page withHeader>
      <ContentContainer>
        <SectionHeading style={{ marginBottom: '32px' }}>
          <Link href="/">
            <a>
              <Subheading><Larr /> Home</Subheading>
            </a>
          </Link>
          <LargeHeading>Overthought</LargeHeading>
          <Subheading>Overthinking out loud about design, development, and building products.</Subheading>
        </SectionHeading>
      </ContentContainer>

      <OverthoughtGrid posts={posts} />
    </Page>
  );
}

Overthought.getInitialProps = async () => {
  const posts = await getPosts();
  return { posts: posts }
}

export default Overthought