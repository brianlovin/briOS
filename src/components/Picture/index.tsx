import * as React from 'react'

interface Props {
  srcset: string[]
  alt: string
  // style?: object
  width: string
  height: string
  lazy?: boolean
}

export default function Picture({ srcset, alt, lazy = true, ...rest }: Props) {
  const assets = []

  srcset.map((src, i) => {
    const key = `${src}-${i}`
    if (src.endsWith('webp'))
      assets.push(<source type="image/webp" srcSet={src} key={key} {...rest} />)
    if (src.endsWith('jpg') || src.endsWith('jpeg'))
      assets.push(<source type="image/jpeg" srcSet={src} key={key} {...rest} />)
    if (src.endsWith('png'))
      assets.push(<source type="image/png" srcSet={src} key={key} {...rest} />)
  })

  const fallback = srcset.find((src) => !src.endsWith('webp'))

  assets.push(
    <img
      loading={lazy ? 'lazy' : 'eager'}
      src={fallback}
      key={fallback}
      alt={alt}
      {...rest}
    />
  )

  return <picture>{assets}</picture>
}
