// @flow
import * as React from 'react';
import type { DesignDetailsPost } from '../../types';
import Card from '../Card';
import {
  Title,
  CardContent,
  DetailsCount,
  ImageContainer,
  Icon,
} from './style';
import { Link as RouteLink } from '../../config/routes';
import AtvImage from '../AtvImage';

type Props = {
  post: DesignDetailsPost,
};

export default function DesignDetailsCard(props: Props) {
  const {
    post: { title, slug, details },
  } = props;
  const src = `/static/img/design-details/${slug}.jpeg`;

  return (
    <RouteLink route="design-detail" params={{ slug }}>
      <a>
        <Card style={{ display: 'flex' }}>
          <ImageContainer>
            <AtvImage src={src} Component={Icon} />
          </ImageContainer>
          <CardContent>
            <Title>{title}</Title>
            <DetailsCount>
              {details.length}
              details
            </DetailsCount>
          </CardContent>
        </Card>
      </a>
    </RouteLink>
  );
}
