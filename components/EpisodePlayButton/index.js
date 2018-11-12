// @flow
import * as React from 'react'
import type { SimplecastEpisode } from '../../types'
import GlobalPlayer from '../GlobalPlayer/context'
import Icon from '../Icon'
import {
  MiniPlayBox,
  IconContainer,
  Label,
} from './style'

type Props = {
  episode: SimplecastEpisode,
}


class EpisodePlayButton extends React.Component<Props> {
  static contextType = GlobalPlayer

  render() {
    const { episode, } = this.props
    const context = this.context

    const shouldInitGlobalPlayer = context.trackQueue.length === 0
    const isSameTrackAsGlobalPlayer = context.trackQueue.length > 0 && context.trackQueue[0].id === episode.id

    let playAction
    
    if (shouldInitGlobalPlayer) {
      playAction = () => context.addTrackToQueue(episode)
    } else {

      if (isSameTrackAsGlobalPlayer) {
        if (context.isPlaying) {
          playAction = () => context.pause()
        } else {
          playAction = () => context.play()
        }
      } else {
        playAction = () => context.addTrackToQueue(episode)
      }
    }
    
    return (
      <MiniPlayBox data-cy="episode-play-button" onClick={playAction}>
        <IconContainer>
          {
            context.isPlaying && isSameTrackAsGlobalPlayer
            ? <Icon glyph="pause" size={16} />
            : <Icon glyph="play" size={16} />
          }
        </IconContainer>

        <Label>{context.isPlaying ? 'Pause' : 'Play'}</Label>
      </MiniPlayBox>
    )
  }
}

export default EpisodePlayButton