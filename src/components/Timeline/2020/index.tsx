import * as React from 'react'
import { March } from './March'
import { July } from './July'
import { June } from './June'
import { January } from './January'
import { April } from './April'
import { December } from './December'

export function Year2020() {
  return (
    <>
      <December />
      <July />
      {/* <June /> */}
      <April />
      <March />
      <January />
    </>
  )
}
