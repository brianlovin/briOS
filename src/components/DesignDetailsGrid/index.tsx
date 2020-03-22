import * as React from 'react';
import designDetailsPosts from '~/data/appDissections';
import DesignDetailsCard from '~/components/DesignDetailsCard';
import { ContentGrid, PreviewContentGrid } from '../Page';

export default function DesignDetailsGrid({ truncate }) {
  const posts = truncate ? designDetailsPosts.slice(0, 4) : designDetailsPosts
  const Grid = truncate ? PreviewContentGrid : ContentGrid
  return (
    <React.Fragment>
      <Grid>
        {posts.map(post => (
          <DesignDetailsCard key={post.slug} post={post} />
        ))}
      </Grid>
    </React.Fragment>
  );
}
