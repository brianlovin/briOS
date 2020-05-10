import * as React from 'react'

export type ButtonSize = 'small' | 'large' | 'default'
export type ButtonProps = {
  size?: ButtonSize
  disabled?: boolean
  children: React.ReactNode | string
  type?: string
  onClick?: Function
  style?: object
}
