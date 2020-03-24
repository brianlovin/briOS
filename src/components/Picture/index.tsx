import * as React from 'react'

interface Props {
  srcset: string[]
  alt: string
}

export default function Picture({ srcset, alt }: Props) {
  const assets = []

  srcset.map((src, i) => {
    const key = `${src}-${i}`
    if (src.endsWith('webp'))
      assets.push(<source type="image/webp" srcSet={src} key={key} />)
    if (src.endsWith('jpg') || src.endsWith('jpeg'))
      assets.push(<source type="image/jpeg" srcSet={src} key={key} />)
    if (src.endsWith('png'))
      assets.push(<source type="image/png" srcSet={src} key={key} />)
  })

  const fallback = srcset.find((src) => !src.endsWith('webp'))

  assets.push(<img src={fallback} key={fallback} alt={alt} />)

  return <picture>{assets}</picture>
}
