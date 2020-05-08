import * as React from 'react'
import { SubscriptionsContainer, SubscriptionAvatar } from './style'

interface ConfigPodcast {
  id: number
  name: string
  slug: string
  description: string
  simplecastId: number
  artworkUrl: string
  iTunesUrl: string
  overcastUrl: string
  pocketCastsUrl: string
  rssFeedUrl: string
  googlePodcastsUrl: string
  castroUrl: string
  breakerUrl: string
  spotifyUrl: string
  applePodcastId: string
  twitterUsername: string
  colors: {
    text: string
    button: string
  }
}

interface Props {
  podcast: ConfigPodcast
}

export default function SubscriptionButtons(props: Props) {
  const { podcast } = props

  return (
    <SubscriptionsContainer>
      {podcast.iTunesUrl && (
        <a href={podcast.iTunesUrl} target="_blank" rel="noopener noreferrer">
          <SubscriptionAvatar
            src="/static/img/subscription_icons/podcasts.png"
            loading="lazy"
            alt="Apple Podcasts"
          />
        </a>
      )}

      {podcast.overcastUrl && (
        <a href={podcast.overcastUrl} target="_blank" rel="noopener noreferrer">
          <SubscriptionAvatar
            src="/static/img/subscription_icons/overcast.png"
            loading="lazy"
            alt="Overcast"
          />
        </a>
      )}

      {podcast.pocketCastsUrl && (
        <a
          href={podcast.pocketCastsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SubscriptionAvatar
            src="/static/img/subscription_icons/pocketcasts.png"
            loading="lazy"
            alt="Pocketcasts"
          />
        </a>
      )}

      {podcast.googlePodcastsUrl && (
        <a
          href={podcast.googlePodcastsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SubscriptionAvatar
            src="/static/img/subscription_icons/google-podcasts.png"
            loading="lazy"
            alt="Google Podcasts"
          />
        </a>
      )}

      {podcast.castroUrl && (
        <a href={podcast.castroUrl} target="_blank" rel="noopener noreferrer">
          <SubscriptionAvatar
            src="/static/img/subscription_icons/castro.png"
            loading="lazy"
            alt="Castro"
          />
        </a>
      )}

      {podcast.breakerUrl && (
        <a href={podcast.breakerUrl} target="_blank" rel="noopener noreferrer">
          <SubscriptionAvatar
            src="/static/img/subscription_icons/breaker.png"
            loading="lazy"
            alt="Breakrer"
          />
        </a>
      )}

      {podcast.spotifyUrl && (
        <a href={podcast.spotifyUrl} target="_blank" rel="noopener noreferrer">
          <SubscriptionAvatar
            src="/static/img/subscription_icons/spotify.png"
            loading="lazy"
            alt="Spotify"
          />
        </a>
      )}

      {podcast.rssFeedUrl && (
        <a href={podcast.rssFeedUrl} target="_blank" rel="noopener noreferrer">
          <SubscriptionAvatar
            src="/static/img/subscription_icons/rss.png"
            loading="lazy"
            alt="RSS Feed"
          />
        </a>
      )}
    </SubscriptionsContainer>
  )
}
