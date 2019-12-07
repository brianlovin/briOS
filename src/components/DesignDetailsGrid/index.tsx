import * as React from 'react';
import { designDetailsPosts } from '~/data';
import DesignDetailsCard from '~/components/DesignDetailsCard';
import { Grid } from './style';

export default function DesignDetailsGrid({ truncate }) {
  const posts = truncate ? designDetailsPosts.slice(0, 3) : designDetailsPosts
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
