// flow
import * as React from 'react'
import { Img } from './style'

type Props = {
  children: React.Node,
  src: string,
  Component?: React.Node,
}

class AtvImage extends React.Component<Props> {
  render() {
    const { children, src, Component } = this.props

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