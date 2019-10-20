import React from 'react';
import { Card, ContentContainer } from './style'
import { PlayerFooter } from './components'
import LoadingSpinner from '../LoadingSpinner';

class LatestEpisode extends React.Component {
  state = {
    episode: null,
    loading: true
  };

  async componentDidMount() {
    return await fetch('https://spec.fm/api/podcasts/1034/episodes')
      .then(res => {
        return res.json();
      })
      .then(res => {
        const episode = res.find(ep => !!ep.published);
        return this.setState({ loading: false, episode });
      })
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const { episode, loading } = this.state;

    if (loading) {
      return (
        <React.Fragment>
          <Card data-cy="design-details-player">
            <ContentContainer>
              <LoadingSpinner />
            </ContentContainer>
          </Card>

          <PlayerFooter />
        </React.Fragment>
      );
    }

    if (!episode) return null;

    const { sharing_url } = episode;
    const [, id] = sharing_url.split('s/');

    if (!id) return null;

    return (
      <React.Fragment>
        <Card data-cy="design-details-player">
          <ContentContainer>
            <iframe
              frameBorder="0"
              height="200px"
              scrolling="no"
              seamless
              src={`https://embed.simplecast.com/${id}?color=f5f5f5`}
              width="100%"
              data-cy="latest-episode"
            />
          </ContentContainer>
        </Card>

        <PlayerFooter />
      </React.Fragment>
    );
  }
}

export default LatestEpisode;