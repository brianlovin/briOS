// @flow
// $FlowIssue
import React, { useReducer, useEffect } from 'react';
import type { SimplecastEpisode } from '../../types';
import { podcasts, api } from '../../config';
import { ATVScript } from '../../lib/atvimg/script';
import { Card, ContentContainer, Date, Title } from './style';
import {
  getDateString,
  PlayerActions,
  PlayerArtwork,
  PlayerFooter,
} from './components';

type State = {
  episode: ?SimplecastEpisode,
  date: string,
  title: string,
};

type ReducerAction = {
  type: string,
  episode: SimplecastEpisode,
};

const reducer = (state: State, action: ReducerAction) => {
  switch (action.type) {
    case 'LOADED':
      return {
        ...state,
        episode: action.episode,
        date: getDateString(action.episode),
        title: action.episode.title,
      };
    case 'ERROR':
      return {
        ...state,
        episode: null,
        date: 'New episodes weekly',
        title: 'View all episodes on the Spec Network',
      };
    default:
      return state;
  }
};

const initialState = {
  episode: null,
  date: 'Loading...',
  title: 'Grabbing the latest episode',
};

export default function DesignDetailsPlayer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { episode, date, title } = state;

  const fetchEpisodes = async () => {
    const episodes = await api.getEpisodes(podcasts[0].id);

    if (episodes && episodes.length > 0) {
      const thisEpisode = episodes.find(e => e.published);
      // $FlowFixMe
      return dispatch({ type: 'LOADED', episode: thisEpisode });
    }

    // $FlowFixMe
    return dispatch({ type: 'ERROR' });
  };

  useEffect(() => {
    fetchEpisodes();
  }, []);

  useEffect(
    // $FlowFixMe
    () => ATVScript(),
    [episode]
  );

  return (
    <React.Fragment>
      <Card data-cy="design-details-player">
        <PlayerArtwork />

        <ContentContainer>
          <Date>{date}</Date>
          <Title>{title}</Title>

          <PlayerActions episode={episode} />
        </ContentContainer>
      </Card>

      <PlayerFooter />
    </React.Fragment>
  );
}
