import * as React from 'react';
import { designDetailsPosts } from '~/data';
import DesignDetailsCard from '~/components/DesignDetailsCard';
import { Grid } from './style';

export default function DesignDetailsGrid() {
  return (
    <React.Fragment>
      <Grid>
        {designDetailsPosts.map(post => (
          <DesignDetailsCard key={post.slug} post={post} />
        ))}
      </Grid>
    </React.Fragment>
  );
}
