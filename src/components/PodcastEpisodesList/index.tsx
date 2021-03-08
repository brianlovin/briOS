import React from 'react'
import { Episode } from '~/graphql/types.generated'
import { format } from 'timeago.js'

interface Props {
  episodes: Episode[]
}

export default function PodcastEpisodesList({ episodes }: Props) {
  return (
    <>
      {episodes.map((ep) => (
        <div className="space-y-1 " key={ep.id}>
          <span>
            <a
              className="font-medium text-primary highlight-link-hover"
              href={`https://designdetails.fm/episodes/${
                ep.legacy_id || ep.token
              }`}
            >
              {ep.title}
            </a>
          </span>
          <p className="text-tertiary">{ep.description}</p>
          <p className="text-quaternary">{format(ep.published_at)}</p>
        </div>
      ))}
    </>
  )
}
