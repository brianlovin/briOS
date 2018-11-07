// flow
import * as React from 'react'
import { Img } from './style'

type Props = {
  src: string,
  Component?: React.Node,
  alt: string,
}

class AtvImage extends React.Component<Props> {
  componentDidUpdate(prev: Props) {
    const curr = this.props
    if (curr.src !== prev.src) console.log('changed src')
  }

  render() {
    const { src, Component, alt } = this.props

    return (
      <div className="atvImg">
      {
        Component
        ? <Component className={'atvImg-layer'} data-img={src} src={src} alt={alt} />
        : <Img className={'atvImg-layer'}  data-img={src} src={src} alt={alt} />
      }
      </div>
    )
  }
}

export default AtvImage