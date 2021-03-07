import Image from 'next/image'
import * as React from 'react'
import podcast from '~/graphql/resolvers/queries/podcast'

export default function SubscriptionButtons() {
  return (
    <div className="flex space-x-4">
      {podcast.iTunesUrl && (
        <a href={podcast.iTunesUrl}>
          <Image
            width="32"
            height="32"
            layout="fixed"
            src="/static/img/subscription_icons/podcasts.png"
            alt="Apple Podcasts"
          />
        </a>
      )}

      {podcast.overcastUrl && (
        <a href={podcast.overcastUrl}>
          <Image
            width="32"
            height="32"
            layout="fixed"
            src="/static/img/subscription_icons/overcast.png"
            alt="Overcast"
          />
        </a>
      )}

      {podcast.pocketCastsUrl && (
        <a href={podcast.pocketCastsUrl}>
          <Image
            width="32"
            height="32"
            layout="fixed"
            src="/static/img/subscription_icons/pocketcasts.png"
            alt="Pocketcasts"
          />
        </a>
      )}

      {podcast.googlePodcastsUrl && (
        <a href={podcast.googlePodcastsUrl}>
          <Image
            width="32"
            height="32"
            layout="fixed"
            src="/static/img/subscription_icons/google-podcasts.png"
            alt="Google Podcasts"
          />
        </a>
      )}

      {podcast.castroUrl && (
        <a href={podcast.castroUrl}>
          <Image
            width="32"
            height="32"
            layout="fixed"
            src="/static/img/subscription_icons/castro.png"
            alt="Castro"
          />
        </a>
      )}

      {podcast.breakerUrl && (
        <a href={podcast.breakerUrl}>
          <Image
            width="32"
            height="32"
            layout="fixed"
            src="/static/img/subscription_icons/breaker.png"
            alt="Breakrer"
          />
        </a>
      )}

      {podcast.spotifyUrl && (
        <a href={podcast.spotifyUrl}>
          <Image
            width="32"
            height="32"
            layout="fixed"
            src="/static/img/subscription_icons/spotify.png"
            alt="Spotify"
          />
        </a>
      )}

      {podcast.rssFeedUrl && (
        <a href={podcast.rssFeedUrl}>
          <Image
            width="32"
            height="32"
            layout="fixed"
            src="/static/img/subscription_icons/rss.png"
            alt="RSS Feed"
          />
        </a>
      )}
    </div>
  )
}
