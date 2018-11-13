// flow
import * as React from 'react';
import { Artwork } from './style';
import AtvImage from '../AtvImage';

type Props = {
  album: {
    url: string,
    artworkUrl: string,
    name: string,
  },
  truncated: boolean,
};

export default function AlbumCard(props: Props) {
  const {
    album: { name, url, artworkUrl },
    truncated,
  } = props;
  const src = truncated ? `${artworkUrl}.lo.jpeg` : `${artworkUrl}.high.jpeg`;

  return (
    <a name={name} href={url} target="_blank" rel="noopener noreferrer">
      <AtvImage alt={name} src={src} Component={Artwork} />
    </a>
  );
}
