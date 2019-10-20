 
import * as React from 'react';
import albums from '../../data/music';
import { Grid, Spacer } from './style';
import AlbumCard from './AlbumCard';

export default function MusicGrid() {
  return (
    <Grid data-cy="music">
      {albums.map(album => (
        <AlbumCard key={album.url} album={album} />
      ))}
      <Spacer />
    </Grid>
  );
}
