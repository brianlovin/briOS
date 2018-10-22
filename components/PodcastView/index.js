// @flow
import * as React from "react";
import Head from 'next/head'
import { Link as RouteLink } from '../../config/routes'
import type { ConfigPodcast, SimplecastEpisode } from '../../types'
import { 
  Grid, 
  Sidebar, 
  Content, 
  Title, 
  Description, 
  Divider, 
  Label,
  MobileArt, 
  MobileSubscriptionOptions,
} from './style'
import PodcastSubscriptionOptions from '../PodcastSubscriptionOptions'
import EpisodesGrid from '../EpisodesGrid'
import PodcastArt from '../PodcastArt'
import PodcastShareButtons from '../PodcastShareButtons'
import CommunityUpsell from '../CommunityUpsell'
 
type Props = {
  podcast: ConfigPodcast,
  episodes: ?Array<SimplecastEpisode>
}

class PodcastView extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    const curr = this.props
    if (curr.podcast !== nextProps.podcast) return true
    return false
  }

  render() {
    const { podcast, episodes } = this.props
    
    return (
      <Grid>

        <Head>
          <title>Spec · {podcast.name}</title>
          <meta content={`Spec · ${podcast.name}`} name="og:title" key="og:title" />
          <meta content={podcast.description} name="og:description" key="og:description" />
          <meta content={`https://spec.fm${podcast.artworkUrl}`} name="og:image" key="og:image" />
          {
            episodes && episodes.length > 0 &&
            <meta content={episodes[0].audio_url} name="twitter:player" key="twitter:player" />
          }
          <meta content={`Spec · ${podcast.name}`} name="twitter:title" key="twitter:title" />
          <meta name="apple-itunes-app" content={`app-id=${podcast.applePodcastId}`} key="apple-itunes-app" />
          <meta name="theme-color" content={podcast.colors.button} key="theme-color" />
        </Head>

        <Sidebar>
          <RouteLink route='podcast' params={{ slug: podcast.slug }}>
            <a>
              <PodcastArt src={podcast.artworkUrl} alt={podcast.name} />
            </a>
          </RouteLink>
          <PodcastSubscriptionOptions podcast={podcast} />

          <Divider>
            <Label>
              Community
            </Label>
          </Divider>
          
          <CommunityUpsell />
        </Sidebar>
        
        <Content>
          <MobileArt>
            <RouteLink route='podcast' params={{ slug: podcast.slug }}>
              <a>
                <PodcastArt src={podcast.artworkUrl} alt={podcast.name} />
              </a>
            </RouteLink>
          </MobileArt>
          <Title>{podcast.name}</Title>
          <Description>{podcast.description}</Description>
          
          <MobileSubscriptionOptions>
            <PodcastSubscriptionOptions podcast={podcast} />
          </MobileSubscriptionOptions>

          <PodcastShareButtons podcast={podcast} />
          
          <EpisodesGrid episodes={episodes} podcast={podcast} />
        </Content>

      </Grid>
    )
  }
}

export default PodcastView;
