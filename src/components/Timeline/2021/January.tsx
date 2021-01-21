import * as React from 'react'
import { BlogPost } from '../BlogPost'
import { DateEntry } from '../Entry'

export function January() {
  return (
    <>
      <DateEntry title="January, 2021" />

      <BlogPost
        image="sentiment-analysis-for-platform-design.jpg"
        timestamp="January 21, 2021"
        slug="sentiment-analysis-for-platform-design"
        title="Data Science for Platform Design and User Engagement"
        description="Part 1: The need for data driven insights to inform product design at PôleFLS"
        divider={false}
      />
    </>
  )
}
