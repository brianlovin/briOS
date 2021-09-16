import * as React from 'react'
import { Episode } from '~/graphql/types.generated'
import Image from 'next/image'
import SegmentedControl from '~/components/SegmentedControl'
import Tooltip from '../Tooltip'
import podcast from '~/data/designDetails'

interface Props {
  episodes: Episode[]
}

export default function DesignDetails({ episodes }: Props) {
  function getFormattedDate(post) {
    return new Date(post.published_at).toLocaleDateString('en-us', {
      month: 'short',
      day: 'numeric',
    })
  }

  const subscriptionOptions = [
    {
      url: podcast.iTunesUrl,
      image: 'apple-podcasts.png',
      alt: 'Subscribe on Apple Podcasts',
    },
    {
      url: podcast.spotifyUrl,
      image: 'spotify.png',
      alt: 'Subscribe on Spotify',
    },
    {
      url: podcast.overcastUrl,
      image: 'overcast.png',
      alt: 'Subscribe on Overcast',
    },
    {
      url: podcast.pocketCastsUrl,
      image: 'pocketcasts.png',
      alt: 'Subscribe on Pocket Casts',
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-design-details-dark">
      <div className="w-full max-w-screen-md mx-auto justify-content">
        <div className="relative fl¬ex flex-col items-center space-y-12 text-center">
          <a
            href="https://designdetails.fm"
            className="inline-flex transition-all shadow-xl transform-gpu hover:scale-105 rounded-2xl hover:shadow-2xl"
          >
            <Image
              src={'/static/img/design-details/artwork.png'}
              width={256}
              height={256}
              layout={'intrinsic'}
              className="rounded-2xl"
            />
          </a>
          <div className="space-y-3">
            <p className="text-5xl font-bold text-design-details dark:text-design-details-light">
              Design Details Podcast
            </p>
            <p className="text-2xl font-medium text-design-details dark:text-design-details-light text-opacity-70">
              A weekly conversation about design process and culture.
            </p>
          </div>

          <div className="flex flex-col w-full p-8 mt-12 space-y-8 text-left bg-opacity-10 bg-design-details dark:bg-design-details-light rounded-2xl">
            <SegmentedControl
              onSetActiveItem={(id) => {}}
              tint={{
                light: 'bg-design-details',
                dark: 'bg-design-details-light',
              }}
              text={{
                active: 'text-design-details',
                inactive: 'text-design-details dark:text-design-details-light',
              }}
              items={[
                { id: 'recent', label: 'Recent' },
                { id: 'popular', label: 'Popular' },
              ]}
            />
            <div className="flex flex-col space-y-6">
              {episodes.map((episode) => {
                const date = getFormattedDate(episode)

                return (
                  <React.Fragment key={episode.id}>
                    <a
                      href={`https://designdetails.fm/episodes/${
                        episode.legacy_id || episode.token
                      }`}
                      className="grid items-center grid-cols-12 gap-4 text-design-details dark:text-design-details-light group text-opacity-90"
                    >
                      <p className="col-span-10 font-medium leading-none group-hover:underline">
                        {episode.title}
                      </p>
                      <p className="col-span-2 font-mono leading-none text-right text-design-details dark:text-design-details-light text-opacity-60">
                        {date}
                      </p>
                    </a>
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          <div className="flex justify-center w-full p-6 mt-12 space-x-8 text-left bg-opacity-10 bg-design-details dark:bg-design-details-light rounded-2xl">
            {subscriptionOptions.map((sub) => (
              <Tooltip content={sub.alt} key={sub.url}>
                <a
                  href={sub.url}
                  className="transition-all scale-100 translate-y-0 hover:-translate-y-1 hover:scale-105 transform-gpu"
                >
                  <Image
                    src={`/static/img/design-details/${sub.image}`}
                    alt={sub.alt}
                    width={44}
                    height={44}
                  />
                </a>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
