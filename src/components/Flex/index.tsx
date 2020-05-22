/* @jsx jsx */
import React from 'react'
import { jsx } from 'theme-ui'
import { Flex as Reflex, BoxProps } from 'reflexbox'

type Props = BoxProps & {
  gap?: number
  children: React.ReactChildren | React.ReactChildren[]
}

export default function Flex(props: Props) {
  // eslint-disable-next-line
  let { children, ...rest } = props

  if (typeof props.gap === 'number' && props.gap !== 0) {
    children = React.Children.map(children, (child, index) => {
      // a child might be rendered conditionally, in which case it will return
      // undefined. We don't want to wrap undefined in a div, so we just skip
      // the element wrapping step early
      if (!child) return

      return jsx(
        'div',
        {
          style:
            index !== 0
              ? {
                  [props.flexDirection === 'column'
                    ? 'marginTop'
                    : 'marginLeft']: `${props.gap}px`,
                }
              : {},
        },
        child
      )
    })
  }

  return jsx(Reflex, rest, children)
}
