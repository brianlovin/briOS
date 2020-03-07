import React from 'react'
import ResetStyles from './reset'
import MarkdownStyles from './markdown'
import PrismStyles from './prism'

export const WithPrismStyles = ({ children }) => (
  <React.Fragment>
    <PrismStyles />
    {children}
  </React.Fragment>
)

export const WithMarkdownStyles = ({ children }) => (
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
  WithPrismStyles
}