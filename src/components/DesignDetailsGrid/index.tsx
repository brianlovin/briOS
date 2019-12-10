import * as React from 'react';
import { designDetailsPosts } from '~/data';
import DesignDetailsCard from '~/components/DesignDetailsCard';
import { ContentGrid } from '../Page';

export default function DesignDetailsGrid({ truncate }) {
  const posts = truncate ? designDetailsPosts.slice(0, 4) : designDetailsPosts
  return (
    <React.Fragment>
      <ContentGrid>
        {posts.map(post => (
          <DesignDetailsCard key={post.slug} post={post} />
        ))}
      </ContentGrid>
    </React.Fragment>
  );
}
