 
import * as React from 'react';
import { useRouter } from 'next/router'
import Page, { SectionHeading } from '../../components/Page';
import { H1, Subheading } from '../../components/Typography'
import { designDetails } from '../../data'
import { DesignDetailsPost } from '../../types';
import DesignDetailView from '../../components/DesignDetailView';
import DesignDetailsGrid from '../../components/DesignDetailsGrid';

type Props = {
  post: DesignDetailsPost,
};

export default function DesignDetail() {
  const router = useRouter()
  const { slug } = router.query
  const post = designDetails.find(post => post.slug === slug)
  
  if (post) {
    return (
      <Page withHeader>
        <DesignDetailView post={post} />
      </Page>
    );
  }

  // bad slug
  return (
    <Page withHeader>
      <SectionHeading>
        <H1>Design Details</H1>
        <Subheading>A visual exploration of digital products</Subheading>
      </SectionHeading>

      <DesignDetailsGrid />
    </Page>
  );
}
