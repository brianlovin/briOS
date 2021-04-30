import * as React from 'react'
import { BlogPost } from '../BlogPost'
import { DateEntry, TimelineEntry, Notes } from '../Entry'
import {
  GitCommit,
  GitMerge,
  Zap,
  Wind,
  Twitter,
  Camera,
  Plus,
  Layers,
} from 'react-feather'
export function April() {
  return (
    <>
      <DateEntry title="April, 2021" />

      <BlogPost
        image="architecture-diagram.jpg"
        timestamp="April 29, 2021"
        slug="creating-a-ranking-dashboard-of-influential-accounts-in-twitter-communities"
        title="Creating a ranking dashboard of influential accounts in twitter communities"
        description="Combining multiple microservices with a graph processing platform to rank communities of users on Twitter using Neo4j, Apache Spark, and RabbitMQ"
        divider={false}
      />
    </>
  )
}
