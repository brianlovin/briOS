import * as React from 'react'
import { Post } from '~/graphql/types.generated'
import OverthoughtSubscribeBox from '~/components/Ghost/Subscribe'
import SyntaxHighlighter from '~/components/SyntaxHighlighter'
import SEO from './SEO'
import Feedback from '../Feedback'
import { FeaturedImage } from './style'
import GlobalPrismStyles from '~/components/GlobalStyles/prism'
import { format } from 'timeago.js'
import { CenteredColumn } from '~/components/Layouts'

interface Props {
  post: Post
}

export default function PostView({ post }: Props) {
  return (
    <React.Fragment>
      <SyntaxHighlighter data={post} />
      <GlobalPrismStyles />
      <SEO post={post} />

      <CenteredColumn data-cy="overthought-post">
        <div className="flex flex-col space-y-8">
          {post.feature_image && (
            <FeaturedImage
              alt={post.title}
              loading="lazy"
              src={post.feature_image}
            />
          )}
          <div className="flex flex-col space-y-4">
            <h1>{post.title}</h1>
            <p className="p-small">Updated {format(post.updated_at)}</p>
          </div>
        </div>

        <div
          style={{ marginTop: '16px' }}
          className="prose lg:prose-lg prose-blue"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <div className="flex flex-col space-y-8">
          <div />
          <div />
          <Feedback post={post} />
          <OverthoughtSubscribeBox />
        </div>
      </CenteredColumn>
    </React.Fragment>
  )
}
