import * as React from 'react'

import { getContext } from '~/graphql/context'
import { GET_POSTS } from '~/graphql/queries/posts'
import { initApolloClient } from '~/lib/apollo'
import { generateRSS } from '~/lib/rss'

const JSONFeed: React.FC = () => null

export default JSONFeed
