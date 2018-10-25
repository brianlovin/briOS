// flow
import * as React from 'react'
import { Img } from './style'

type Props = {
  src: string,
  Component?: React.Node,
}

class AtvImage extends React.Component<Props> {
  componentDidUpdate(prev: Props) {
    const curr = this.props
    if (curr.src !== prev.src) console.log('changed src')
  }

  render() {
    const { src, Component } = this.props

    return (
      <div className="atvImg">
      {
        Component
        ? <Component className={'atvImg-layer'} data-img={src} src={src} />
        : <Img className={'atvImg-layer'}  data-img={src} src={src} />
      }
      </div>
    )
  }
}

export default AtvImage