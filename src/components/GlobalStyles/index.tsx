import React from 'react'
import ResetStyles from './reset'
import MarkdownStyles from './markdown'
import PrismStyles from './prism'

interface Props {
  children: React.ReactNode | string
}

export const WithPrismStyles = ({ children }: Props) => (
  <React.Fragment>
    <PrismStyles />
    {children}
  </React.Fragment>
)

export const WithMarkdownStyles = ({ children }: Props) => (
  <React.Fragment>
    <MarkdownStyles />
    {children}
  </React.Fragment>
)

export default {
  ResetStyles,
  MarkdownStyles,
  PrismStyles,
  WithMarkdownStyles,
  WithPrismStyles,
}
