// flow
import * as React from 'react';
import { Artwork } from './style';
import AtvImage from '../AtvImage';

type Props = {
  book: {
    url: string,
    artworkUrl: string,
  },
  truncated: boolean,
};

export default function Bookcard(props: Props) {
  const {
    book: { name, url, artworkUrl },
    truncated,
  } = props;
  const src = truncated ? `${artworkUrl}.lo.jpeg` : `${artworkUrl}.high.jpeg`;

  return (
    <a name={name} href={url} target="_blank" rel="noopener noreferrer">
      <AtvImage alt={name} src={src} Component={Artwork} />
    </a>
  );
}
