import * as React from 'react';
import Link from 'next/link';
import { designDetails } from '../../data';
import DesignDetailsCard from '../DesignDetailsCard';
import { Grid, ViewMoreContainer } from './style';
import { GhostButton } from '../Button';

type Props = {
  truncated: boolean,
};

export default function DesignDetailsGrid(props: Props) {
  const { truncated } = props;
  const posts = truncated ? designDetails.slice(0, 4) : designDetails;

  return (
    <React.Fragment>
      <Grid>
        {posts.map(post => (
          <DesignDetailsCard key={post.slug} post={post} />
        ))}
      </Grid>

      {truncated && (
        <ViewMoreContainer data-cy="view-all-design-details">
          <Link href="/design-details">
            <GhostButton>
              View all {designDetails.length} explorations
            </GhostButton>
          </Link>
        </ViewMoreContainer>
      )}
    </React.Fragment>
  );
}
