// @flow
import * as React from 'react'
import type { ConfigPodcast } from '../../types'
import { Grid, Option, Avatar, Label, Arrow } from './style'

type Props = {
  podcast: ConfigPodcast
}

class PodcastSubscriptionOptions extends React.Component<Props> {
  render() {
    const { podcast } = this.props

    return (
      <Grid>
        {
          podcast.iTunesUrl &&
          <a href={podcast.iTunesUrl} target={"_blank"} rel={"noopener noreferrer"}>
            <Option>
              <Avatar src={'/static/img/subscription_icons/podcasts.png'} alt={'Apple Podcasts'} />
              <Label>Apple Podcasts</Label>
              <Arrow />
            </Option>
          </a>
        }

        {
          podcast.overcastUrl &&
          <a href={podcast.overcastUrl} target={"_blank"} rel={"noopener noreferrer"}>
            <Option>
              <Avatar src={'/static/img/subscription_icons/overcast.png'} alt={'Overcast'} />
              <Label>Overcast</Label>
              <Arrow />
            </Option>
          </a>
        }

        {
          podcast.pocketCastsUrl &&
          <a href={podcast.pocketCastsUrl} target={"_blank"} rel={"noopener noreferrer"}>
            <Option>
              <Avatar src={'/static/img/subscription_icons/pocketcasts.png'} alt={'Pocketcasts'} />
              <Label>PocketCasts</Label>
              <Arrow />
            </Option>
          </a>
        }

        {
          podcast.googlePodcastsUrl &&
          <a href={podcast.googlePodcastsUrl} target={"_blank"} rel={"noopener noreferrer"}>
            <Option>
              <Avatar src={'/static/img/subscription_icons/google-podcasts.png'} alt={'Google Podcasts'} />
              <Label>Google Podcasts</Label>
              <Arrow />
            </Option>
          </a>
        }

        {
          podcast.castroUrl &&
          <a href={podcast.castroUrl} target={"_blank"} rel={"noopener noreferrer"}>
            <Option>
              <Avatar src={'/static/img/subscription_icons/castro.png'} alt={'Castro'} />
              <Label>Castro</Label>
              <Arrow />
            </Option>
          </a>
        }

        {
          podcast.breakerUrl &&
          <a href={podcast.breakerUrl} target={"_blank"} rel={"noopener noreferrer"}>
            <Option>
              <Avatar src={'/static/img/subscription_icons/breaker.png'} alt={'Breakrer'} />
              <Label>Breaker</Label>
              <Arrow />
            </Option>
          </a>
        }

        {
          podcast.rssFeedUrl &&
          <a href={podcast.rssFeedUrl} target={"_blank"} rel={"noopener noreferrer"}>
            <Option>
              <Avatar src={'/static/img/subscription_icons/rss.png'} alt={'RSS Feed'} />
              <Label>RSS Feed</Label>
              <Arrow />
            </Option>
          </a>
        }
      </Grid>
    )
  }
}

export default PodcastSubscriptionOptions