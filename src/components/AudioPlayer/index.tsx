import { useMutation } from '@apollo/client'
import * as React from 'react'
import {
  ADD_AMA_AUDIO_PLAY,
  ADD_AMA_QUESTION_REACTION,
} from '~/graphql/mutations/ama'
import HiddenAudioPlayer from './HiddenAudioPlayer'
import PlayPauseButton from './PlayPauseButton'
import ProgressOverlay from './ProgressOverlay'
import Waveform from './Waveform'

interface Props {
  src: string
  setWaveformData?: Function
  waveform: number[]
  id: string | null
}

export default function AudioPlayer({
  src,
  setWaveformData,
  waveform,
  id,
}: Props) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const audioRef = React.useRef(null)
  const scrubbableRef = React.useRef(null)
  const progressOverlayRef = React.useRef(null)
  const [hasPlayedOnce, setHasPlayedOnce] = React.useState(false)
  const [incrementPlayCount] = useMutation(ADD_AMA_AUDIO_PLAY)

  React.useEffect(() => {
    resetProgressOverlay()

    audioRef.current.addEventListener('play', onAudioElementPlay)
    audioRef.current.addEventListener('pause', onAudioElementPause)
    audioRef.current.addEventListener('ended', onAudioElementEnded)

    return function cleanupListeners() {
      audioRef.current.removeEventListener('play', onAudioElementPlay)
      audioRef.current.removeEventListener('pause', onAudioElementPause)
      audioRef.current.removeEventListener('ended', onAudioElementEnded)
    }
  }, [])

  function pause() {
    const player = audioRef.current

    player.pause()
    const progress = player.currentTime / player.duration
    setProgressOverlayScale(progress)
    setIsPlaying(false)
  }

  async function play() {
    const player = audioRef.current
    player.play()

    if (!hasPlayedOnce && id) {
      incrementPlayCount({ variables: { id } })
      setHasPlayedOnce(true)
    }

    // bug where browser thinks duration is infiniy, wait for it to update
    while (player.duration === Infinity) {
      await new Promise((r) => setTimeout(r, 10))
    }

    const remainingTime = player.duration - player.currentTime

    setProgressOverlayRemainingDuration(remainingTime)
    setProgressOverlayScale(1)
    setIsPlaying(true)
  }

  function onAudioElementEnded() {
    audioRef.current.currentTime = 0
    resetProgressOverlay()
    setIsPlaying(false)
  }

  function onAudioElementPlay() {
    setIsPlaying(true)
  }

  function onAudioElementPause() {
    setIsPlaying(false)
  }

  function togglePlay() {
    // pause all other audio players
    const audios = document.querySelectorAll('audio')
    audios.forEach((audio) => audio.pause())

    // pause or play this audio player
    isPlaying ? pause() : play()
  }

  function scrub(e) {
    let bounds = scrubbableRef.current.getBoundingClientRect()
    let start = bounds.left
    let end = bounds.right
    let width = end - start
    let point = e.pageX
    let offset = point - start
    let percentage = offset / width
    let player = audioRef.current

    player.currentTime = percentage * player.duration
    resetProgressOverlay()

    let progress = player.currentTime / player.duration
    setProgressOverlayScale(progress)

    player.play()
    setIsPlaying(true)

    setTimeout(() => {
      let remainingTime = player.duration - player.currentTime
      setProgressOverlayRemainingDuration(remainingTime)
      setProgressOverlayScale(1)
    }, 1)
  }

  function resetProgressOverlay() {
    progressOverlayRef.current.style.transitionProperty = 'transform'
    progressOverlayRef.current.style.transitionDuration = '0s'
    progressOverlayRef.current.style.transitionTimingFunction = 'linear'
    setProgressOverlayScale(0)
  }

  function setProgressOverlayRemainingDuration(duration: number) {
    progressOverlayRef.current.style.transitionDuration = `${duration}s`
  }

  function setProgressOverlayScale(num: number) {
    progressOverlayRef.current.style.transform = `scaleX(${num})`
  }

  return (
    <div>
      <HiddenAudioPlayer ref={audioRef} src={src} />

      <div className="flex items-center p-2 pr-6 space-x-1 space-x-4 text-white bg-white border rounded-md shadow-sm dark:border-gray-700 dark:text-white dark:bg-gray-800">
        <PlayPauseButton isPlaying={isPlaying} onClick={togglePlay} />
        <div
          ref={scrubbableRef}
          onClick={scrub}
          className="relative flex items-center w-full space-x-1"
        >
          <ProgressOverlay ref={progressOverlayRef} />
          <Waveform
            src={src}
            waveform={waveform}
            setWaveformData={setWaveformData}
          />
        </div>
      </div>
    </div>
  )
}
