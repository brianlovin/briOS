import React from 'react'
import { Episode } from '~/graphql/types.generated'
import { format } from 'timeago.js'

interface Props {
  episodes: Episode[]
}

export default function PodcastEpisodesList({ episodes }: Props) {
  return (
    <div className="flex flex-col space-y-4">
      {episodes.map((ep) => (
        <div className="flex flex-col space-y-1" key={ep.id}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://designdetails.fm/episodes/${
              ep.legacy_id || ep.token
            }`}
          >
            {ep.title}
          </a>
          <p className="clamp-2">{ep.description}</p>
          <p className="p-small">Released {format(ep.published_at)}</p>
        </div>
      ))}
    </div>
  )
}
