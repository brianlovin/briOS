// @flow
import * as React from 'react';
import { designDetails } from '../../config';
import DesignDetailsCard from '../DesignDetailsCard';
import { Grid, ViewMoreContainer } from './style';
import { Link as RouteLink } from '../../config/routes';
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
          <RouteLink route="design-details">
            <GhostButton>
              View all {designDetails.length} explorations
            </GhostButton>
          </RouteLink>
        </ViewMoreContainer>
      )}
    </React.Fragment>
  );
}
