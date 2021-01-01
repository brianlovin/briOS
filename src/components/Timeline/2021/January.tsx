import * as React from 'react'
import { BlogPost } from '../BlogPost'
import { DateEntry } from '../Entry'

export function January() {
  return (
    <>
      <DateEntry title="January, 2021" />

      <BlogPost
        image="2020-in-review.jpg"
        timestamp="January 1, 2021"
        slug="2020-in-review"
        title="2020 in review"
        description="Looking back on 2020 and setting goals for the next year."
        divider={false}
      />
    </>
  )
}
