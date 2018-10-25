// @flow
import App, {Container} from 'next/app'
import * as React from 'react'
import Head from 'next/head'
import withNProgress from "next-nprogress";
import NProgressStyles from "next-nprogress/styles";
import { theme } from '../components/theme'
import GlobalPlayerContext, { defaultPlayerContext } from '../components/GlobalPlayer/context'
import GlobalPlayer from '../components/GlobalPlayer'
import type { SimplecastEpisode } from '../types'
import { GlobalStyles } from '../static/normalize'
import { ATVImgStyles } from '../lib/atvimg/style'
import { ATVScript } from '../lib/atvimg/script'

class MyApp extends App {
  constructor() {
    super() 

    this.state = {
      ...defaultPlayerContext,
      addTrackToQueue: this.addTrackToQueue,
      clearQueue: this.clearQueue,
      pause: this.pause,
      play: this.play,
      scrub: this.scrub,
      onProgress: this.onProgress,
      onTrackEnded: this.onTrackEnded,
    }
  }

  componentDidMount() {
    ATVScript()
  }

  componentDidUpdate() {
    ATVScript()
  }

  addTrackToQueue = (episode: SimplecastEpisode) => {
    this.setState(state => ({
      ...state,
      isPlaying: true,
      trackQueue: [episode],
      progress: 0,
      displaySubscriptions: false,
    }))
  }

  clearQueue = () => this.setState(state => ({ 
    ...state, 
    trackQueue: [],
    progress: 0,
    displaySubscriptions: false,
    isPlaying: false
  }))

  getAudioElement = () => document && document.getElementById('global-player-audio')

  pause = () => {
    const el = this.getAudioElement()
    if (el) {
      // $FlowIssue
      el.pause()
      this.setState(state => ({ ...state, isPlaying: false }))
    }
  }

  play = () => {
    const el = this.getAudioElement()
    if (el) {
      // $FlowIssue
      el.play()
      this.setState(state => ({ ...state, isPlaying: true }))
    }
  }

  scrub = (ev: any) => {
    const { value } = ev.target
    const el = this.getAudioElement()

    if (el) {
      // $FlowIssue
      el.currentTime = value
      this.setState(state => ({ ...state, progress: value }))
      this.play()
    }
  }

  onProgress = () => {
    const el = this.getAudioElement()
    if (el) {
      // $FlowIssue
      this.setState(state => ({ ...state, progress: el.currentTime }))
    }
  }

  onTrackEnded = () => {
    this.pause()
    this.setState(state => ({ ...state, displaySubscriptions: true, progress: 0 }))
  }

  render () {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <GlobalStyles />
        <ATVImgStyles />

        <NProgressStyles color={theme.brand.default} />
        <Head>
          <title>Brian Lovin · Nice Boy™</title>
          <meta content="@brian_lovin" name="twitter:site" key="twitter:site" />
          <meta content={"Brian Lovin · Nice Boy™"} name="og:title" key="og:title" />
          <meta content={"Designer"} name="og:description" key="og:description" />
          <meta content={"Brian Lovin · Nice Boy™"} name="twitter:title" key="twitter:title" />
          <meta name="og:type" content="website" key="og:type" />
          <meta name="og:image" content="https://brianlovin.com/static/og-image.jpg" key="og:image" />
          <meta name="og:site_name" content="Brian Lovin" key="og:site_name" />
          <meta name="theme-color" content="#212325" key="theme-color" />
          <meta name="description" content="Designer"/>

          <link rel="apple-touch-icon" sizes="180x180" href="static/meta/apple-touch-icon.png" />
          <link rel="manifest" href="/static/meta/site.webmanifest" />
          <link rel="mask-icon" href="/static/meta/safari-pinned-tab.svg" color="#212325" />
          <meta name="msapplication-TileColor" content="#ffffff" />

          {this.props.styleTags}
        </Head>
        
        <GlobalPlayerContext.Provider value={this.state}>
          <Component {...pageProps} />
          <GlobalPlayer />
        </GlobalPlayerContext.Provider>

      </Container>
    )
  }
}

const msDelay = 500;
export default withNProgress(msDelay)(MyApp);