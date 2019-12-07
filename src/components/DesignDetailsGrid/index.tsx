import * as React from 'react';
import { designDetails } from '~/data';
import DesignDetailsCard from '~/components/DesignDetailsCard';
import { Grid } from './style';

export default function DesignDetailsGrid() {
  return (
    <React.Fragment>
      <Grid>
        {designDetails.map(post => (
          <DesignDetailsCard key={post.slug} post={post} />
        ))}
      </Grid>
    </React.Fragment>
  );
}
