// @flow
import * as React from 'react';
import data from '../../config/music';
import { Grid, Spacer } from './style';
import AlbumCard from './AlbumCard';

type Props = {
  truncated: boolean,
};

export default function MusicGrid(props: Props) {
  const { truncated } = props;
  const albums = truncated ? data.slice(0, 5) : data;

  return (
    <Grid data-cy="music">
      {albums.map(album => (
        <AlbumCard truncated={truncated} key={album.url} album={album} />
      ))}
      <Spacer />
    </Grid>
  );
}
