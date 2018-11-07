// flow
import * as React from 'react'
import { Artwork } from './style'
import AtvImage from '../AtvImage'

type Props = {
  album: {
    url: string,
    artworkUrl: string,
    name: string,
  },
  truncated: boolean,
}

class AlbumCard extends React.Component<Props> {
  render() {
    const { album: { name, url, artworkUrl }, truncated } = this.props
    const src = truncated ? `${artworkUrl}.lo.jpeg` : `${artworkUrl}.high.jpeg`
    
    return (
      <a name={name} href={url} target="_blank" rel="noopener noreferrer">
        <AtvImage src={src} Component={Artwork} />
      </a>
    )
  }
}

export default AlbumCard