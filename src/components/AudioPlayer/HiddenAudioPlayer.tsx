import * as React from 'react'

interface Props {
  src: string
}

const HiddenAudioPlayer = React.forwardRef<HTMLAudioElement, Props>(
  ({ src }: Props, ref) => {
    return (
      <audio preload="metadata" ref={ref} controls={false} className="hidden">
        <source src={src} type="audio/mp3" />
        Your browser does not support the audio element
      </audio>
    )
  }
)

export default HiddenAudioPlayer
