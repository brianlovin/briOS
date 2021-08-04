import * as React from 'react'

interface Props {
  src: string
  setWaveformData?: Function
  waveform: number[]
}

export default function Waveform({
  src,
  setWaveformData,
  waveform = [],
}: Props) {
  const [audioContext, setAudioContext] = React.useState(null)
  const [hasDrawnAudio, setHasDrawnAudio] = React.useState(false)
  const [bars, setBars] = React.useState(waveform)

  const drawAudio = (url, sampleCount) => {
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) =>
        draw(normalizeData(filterData(audioBuffer, sampleCount)))
      )
  }

  const filterData = (audioBuffer, sampleCount) => {
    const rawData = audioBuffer.getChannelData(0) // We only need to work with one channel of data
    const samples = sampleCount // Number of samples we want to have in our final data set
    const blockSize = Math.floor(rawData.length / samples) // the number of samples in each subdivision
    const filteredData = []
    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i // the location of the first sample in the block
      let sum = 0
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
      }
      filteredData.push(sum / blockSize) // divide the sum by the block size to get the average
    }
    return filteredData
  }

  const normalizeData = (filteredData) => {
    const multiplier = Math.pow(Math.max(...filteredData), -1)
    return filteredData.map((n) => n * multiplier)
  }

  const draw = (normalizedData) => {
    setWaveformData && setWaveformData(normalizedData)
    return setBars(normalizedData)
  }

  React.useEffect(() => {
    let context = new AudioContext()

    setAudioContext(context)

    return () => {
      if (audioContext) {
        audioContext.close()
      }
    }
  }, [])

  React.useEffect(() => {
    if (audioContext && !hasDrawnAudio) {
      const width = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      )
      let sampleCount = 64
      if (width < 800) sampleCount = 48
      if (width < 600) sampleCount = 40
      if (width < 400) sampleCount = 32
      drawAudio(src, sampleCount)
      setHasDrawnAudio(true)
    }
  }, [audioContext])

  return (
    <>
      {bars &&
        bars.map((bar, i) => {
          const height = `${bar * 40}px`
          return (
            <span
              key={i}
              style={{ height, minWidth: '2px' }}
              className="w-full bg-gray-800 rounded-md dark:bg-gray-200"
            />
          )
        })}
    </>
  )
}
