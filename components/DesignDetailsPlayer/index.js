// @flow
// $FlowIssue
import React, { useReducer, useEffect } from 'react'
import type { SimplecastEpisode } from '../../types'
import { podcasts, api } from '../../config'
import { ATVScript } from '../../lib/atvimg/script'
import { Card, ContentContainer, Date, Title } from './style'
import { getDateString, PlayerActions, PlayerArtwork, PlayerFooter} from './components'

type State = {
  episode: ?SimplecastEpisode,
  isLoading: boolean,
  hasError: boolean,
  date: string,
  title: string,
}

type ReducerAction = {
  type: string,
  episode: SimplecastEpisode
}

const reducer = (state: State, action: ReducerAction) => {
  switch(action.type) {
    case 'LOADED':
      return {
        ...state,
        isLoading: false,
        hasError: false,
        episode: action.episode,
        date: getDateString(action.episode),
        title: action.episode.title
      }
    case 'ERROR': 
      return {
        ...state,
        isLoading: false,
        hasError: true,
        episode: null,
        date: 'New episodes weekly',
        title: 'View all episodes on the Spec Network'
      }
    default: return state
  }
}

const initialState = {
  episode: null,
  isLoading: true,
  hasError: false,
  date: 'Loading...',
  title: 'Grabbing the latest episode'
}

export default () => {
  const [ state, dispatch ] = useReducer(reducer, initialState)
  
  const { episode, isLoading, hasError, date, title } = state

  useEffect(async () => {
    const episodes = await api.getEpisodes(podcasts[0].id)
    if (episodes && episodes.length > 0) return dispatch({ type: 'LOADED', episode: episodes[0] })
    return dispatch({ type: 'ERROR' })
  }, [])

  useEffect(async () => { ATVScript() }, [ episode ])

  return (
    <React.Fragment>
      <Card>
        <PlayerArtwork />

        <ContentContainer>
          <Date>{date}</Date>
          <Title>{title}</Title>

          <PlayerActions episode={episode} />
        </ContentContainer>
      </Card>

      <PlayerFooter />
    </React.Fragment>
  )
}