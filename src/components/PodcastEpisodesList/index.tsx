import React from 'react'
import { Ul, Li, LineClamp } from '~/components/Typography'
import { SimplecastEpisode } from '~/types'

interface Props {
  episodes: SimplecastEpisode[]
}

export default function PodcastEpisodesList({ episodes }: Props) {
  return (
    <Ul style={{ listStyleType: 'none', marginLeft: 0 }}>
      {episodes.map((ep) => {
        return (
          <Li key={ep.id}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://spec.fm/podcasts/design-details/${ep.id}`}
            >
              {ep.title}
            </a>
            <LineClamp lines={2}>{ep.description}</LineClamp>
          </Li>
        )
      })}
    </Ul>
  )
}
