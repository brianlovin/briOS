// @flow
import * as React from 'react'
import * as Styled from './style'
import Icon from '../Icon'
import Clipboard from 'react-clipboard.js'

export type Size = 'small' | 'large' | 'default';
export type Props = {
  size?: Size,
  disabled?: boolean,
  children: React.Node,
};

export const ButtonRow = Styled.ButtonRow
export const ButtonSegmentRow = Styled.ButtonSegmentRow

export class Button extends React.Component<Props> {
  render() {
    return (
      <Styled.Button {...this.props}>
        {this.props.children}
      </Styled.Button>
    )
  }
}

export class PrimaryButton extends React.Component<Props> {
  render() {
    return (
      <Styled.PrimaryButton {...this.props}>
        {this.props.children}
      </Styled.PrimaryButton>
    )
  }
}

export class GhostButton extends React.Component<Props> {
  render() {
    return (
      <Styled.GhostButton {...this.props}>
        {this.props.children}
      </Styled.GhostButton>
    )
  }
}

export class OutlineButton extends React.Component<Props> {
  render() {
    return (
      <Styled.OutlineButton {...this.props}>
        {this.props.children}
      </Styled.OutlineButton>
    )
  }
}

export class FacebookButton extends React.Component<Props> {
  render() {
    return (
      <Styled.FacebookButton {...this.props}>
        <Icon glyph="facebook" size={24} />
        {this.props.children}
      </Styled.FacebookButton>
    )
  }
}

export class TwitterButton extends React.Component<Props> {
  render() {
    return (
      <Styled.TwitterButton {...this.props}>
        <Icon glyph="twitter" size={24} />
        {this.props.children}
      </Styled.TwitterButton>
    )
  }
}

type CopyLinkProps = {
  ...$Exact<Props>,
  text: string,
}

type CopyLinkState = {
  isClicked: boolean
}

export class CopyLinkButton extends React.Component<CopyLinkProps, CopyLinkState> {
  ref: ?any;
  ref = null;
  state = {
    isClicked: false
  }

  onClick = () => {
    this.setState({ isClicked: true })

    const ref = setTimeout(() => {
      return this.setState({ isClicked: false });
    }, 2000);
    this.ref = ref;
  }

  render() {
    const { text } = this.props
    const { isClicked } = this.state
    return (
      <Clipboard
        style={{ background: 'none' }}
        data-clipboard-text={text}
        onSuccess={this.onClick}
        component="a"
      >
        <Styled.CopyLinkButton isClicked={isClicked} {...this.props}>
          <Icon glyph="link" size={24} />
          {
            isClicked
            ? 'Copied!'
            : this.props.children
          }
        </Styled.CopyLinkButton>
      </Clipboard>
    )
  }
}
