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
};

export default function AlbumCard(props: Props) {
  const {
    album: { name, url, artworkUrl },
  } = props;
  const src = `${artworkUrl}.lo.jpeg`;

  return (
    <a name={name} href={url} target="_blank" rel="noopener noreferrer">
      <AtvImage alt={name} src={src} Component={Artwork} />
    </a>
  );
}
