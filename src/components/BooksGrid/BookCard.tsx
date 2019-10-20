import * as React from 'react';
import { Artwork } from './style';
import AtvImage from '../AtvImage';

type Props = {
  book: {
    name: string,
    url: string,
    artworkUrl: string,
  },
};

export default function Bookcard(props: Props) {
  const {
    book: { name, url, artworkUrl },
  } = props;
  const src = `${artworkUrl}.lo.jpeg`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <AtvImage alt={name} src={src} Component={Artwork} />
    </a>
  );
}
