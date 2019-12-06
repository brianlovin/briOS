 
import * as React from 'react';
import Link from 'next/link';
import Page, { SectionHeading, ContentContainer } from '../../components/Page';
import OverthoughtGrid from '../../components/OverthoughtGrid'
import { H1, Larr, Subheading } from '../../components/Typography'
import { getPosts } from '../../data/ghost'
import { BlogPost } from '../../types'

interface Props {
  posts?: Array<BlogPost>
}

function Overthought({ posts }: Props) {
  return (
    <Page withHeader>
      <ContentContainer data-cy="overthought">
        <SectionHeading>
          
          <Link href="/">
            <a>
              <Subheading><Larr /> Home</Subheading>
            </a>
          </Link>

          <div style={{ padding: '16px' }} />

          <H1>Overthought</H1>
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