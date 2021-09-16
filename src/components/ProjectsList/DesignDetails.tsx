import * as React from 'react'
import podcast from '~/data/designDetails'
import { ArrowRight } from 'react-feather'

export default function DesignDetails({ episodes }) {
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
    <div className="overflow-hidden bg-gray-200 bg-opacity-50 rounded-lg dark:bg-gray-900">
      <div className="flex items-center p-2">
        <a href="https://designdetails.fm" className="inline-block">
          {/* <Image
            src={'/static/img/design-details/artwork.png'}
            width={404}
            height={404}
            layout={'intrinsic'}
            className="rounded-lg"
          /> */}
        </a>

        <div className="px-6 py-4 space-y-2">
          <p className="text-3xl font-bold text-primary">
            Design Details Podcast
          </p>
          <p className="text-xl leading-snug text-tertiary">
            A weekly conversation about design process and culture, co-hosted
            with{' '}
            <a
              href="https://twitter.com/marshallbock"
              className="highlight-link"
            >
              @marshallbock
            </a>
            .
          </p>
          {/* <div className="flex pt-4 space-x-6">
            {subscriptionOptions.map((sub) => (
              <Tooltip content={sub.alt} key={sub.url}>
                <a href={sub.url}>
                  <Image
                    src={`/static/img/design-details/${sub.image}`}
                    alt={sub.alt}
                    width={44}
                    height={44}
                  />
                </a>
              </Tooltip>
            ))}
            </div>*/}
        </div>
      </div>

      <div className="flex flex-col p-2 dark:border-gray-800 dark:divide-gray-800">
        {episodes.map((ep) => {
          const date = new Date(ep.published_at).toLocaleDateString('en-us', {
            month: 'short',
            day: 'numeric',
          })
          return (
            <a
              key={ep.id}
              className="transition-all transform-gpu rounded-md shadow-none hover:-translate-y-0.5 text-primary hover:bg-white hover:shadow-sm dark:hover:bg-gray-800"
              href={`https://designdetails.fm/episodes/${
                ep.legacy_id || ep.token
              }`}
            >
              <div className="grid items-center grid-cols-8 gap-4 px-6 py-4">
                <p className="col-span-1 text-quaternary">{date}</p>
                <p className="col-span-7 font-medium">{ep.title}</p>
              </div>
            </a>
          )
        })}
        <a
          className="transition-all transform-gpu rounded-md hover:-translate-y-0.5 shadow-none text-tertiary hover:bg-white hover:shadow-sm dark:hover:bg-gray-800"
          href={`https://designdetails.fm/`}
        >
          <div className="flex justify-between px-6 py-4 space-y-1">
            <p className="font-medium">View all </p>
            <p className="text-quaternary">
              <ArrowRight size={16} />
            </p>
          </div>
        </a>
      </div>
    </div>
  )
}
