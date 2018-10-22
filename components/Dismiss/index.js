// @flow
import * as React from 'react'
import { Dismiss } from './style'

type Props = {
  onDismiss: Function,
  color?: Function
}

class DismissButton extends React.Component<Props> {
  render() {
    const { onDismiss, color } = this.props

    return (
      <Dismiss onClick={onDismiss} tint={color}><i>×</i></Dismiss>
    )
  }
}

export default DismissButton