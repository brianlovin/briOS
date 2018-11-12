// @flow
// $FlowIssue
import React, { useState, useRef } from 'react'
import type { Node } from 'react'
import dynamic from 'next/dynamic'
import * as Styled from './style'
import Icon from '../Icon'
const Clipboard = dynamic(() => import('react-clipboard.js'), {
  ssr: false
})

export type Size = 'small' | 'large' | 'default';
export type Props = {
  size?: Size,
  disabled?: boolean,
  children: Node,
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

export const CopyLinkButton = (props: CopyLinkProps) => {
  const { text } = props
  let buttonRef = useRef(null)
  const [ isClicked, handleClick ] = useState(false)

  const onClick = () => {
    handleClick(true)
    const ref = setTimeout(() => handleClick(false), 2000);
    buttonRef = ref;
  }

  return (
    <Clipboard
      style={{ background: 'none' }}
      data-clipboard-text={text}
      onSuccess={onClick}
      component="a"
    >
      <Styled.CopyLinkButton data-cy="copy-link-button" isClicked={isClicked} {...props}>
        <Icon glyph="link" size={24} />
        {
          isClicked
          ? 'Copied!'
          : props.children
        }
      </Styled.CopyLinkButton>
    </Clipboard>
  )
}
