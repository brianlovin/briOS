import * as React from 'react'
import { BlogPost } from '../BlogPost'
import { DateEntry } from '../Entry'

export function February() {
  return (
    <>
      <DateEntry title="February, 2021" />

      <BlogPost
        image="zero-to-one.jpg"
        timestamp="February 14, 2021"
        slug="zero-to-one"
        title="Zero to One: Notes on Startups, or How to Build the Future"
        description="Personal notes on questions and lessons learnt from Peter Thiel's Zero to One"
        divider={false}
      />
    </>
  )
}
