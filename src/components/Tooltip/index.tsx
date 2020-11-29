import * as React from 'react'
import Tippy from '@tippy.js/react'
import 'tippy.js/dist/tippy.css'

interface Props {
  content: string
  style?: any
  children: any
}

export default function Tooltip(props: Props) {
  const { style = {}, content, ...rest } = props

  return (
    <Tippy
      placement="top"
      touch={false}
      arrow={true}
      hideOnClick={false}
      content={
        <span className="font-medium" style={{ ...style }}>
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
