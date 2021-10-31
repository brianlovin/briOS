import 'tippy.js/dist/tippy.css'

import Tippy from '@tippy.js/react'
import * as React from 'react'

interface Props {
  content: string
  style?: any
  children: any
}

export function Tooltip(props: Props) {
  const { style = {}, content, ...rest } = props

  return (
    <Tippy
      placement="top"
      touch={false}
      arrow={true}
      hideOnClick={false}
      content={
        <span className="text-sm font-medium" style={{ ...style }}>
          {content}
        </span>
      }
      // https://github.com/FezVrasta/popper.js/issues/535
      popperOptions={{
        modifiers: {
          preventOverflow: {
            boundariesElement: 'window',
          },
        },
      }}
      {...rest}
    />
  )
}
