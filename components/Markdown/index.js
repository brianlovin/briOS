// @flow
import * as React from 'react'
import { Notes } from './style'

type Props = {
  children: React.Node
}

function LinkRenderer(props: any) {
  return <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a>
}

class Markdown extends React.Component<Props> {
  render() {
    return (
      <Notes renderers={{ link: LinkRenderer }}>
        {this.props.children}
      </Notes>
    )
  }
}

export default Markdown