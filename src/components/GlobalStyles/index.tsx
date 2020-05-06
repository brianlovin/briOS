import React from 'react'
import ResetStyles from './reset'
import MarkdownStyles from './markdown'
import PrismStyles from './prism'

interface Props {
  children: React.ReactNode | string
}

export default {
  ResetStyles,
  MarkdownStyles,
  PrismStyles,
}
