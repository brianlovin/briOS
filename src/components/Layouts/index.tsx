import * as React from 'react'

export function CenteredColumn({ children }) {
  return (
    <div className=" max-w-screen-sm mx-auto justify-content">{children}</div>
  )
}
