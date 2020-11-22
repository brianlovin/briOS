import React from 'react'
import DesignDetailMedia from '~/components/DesignDetailMedia'
import Markdown from '~/components/MarkdownRenderer'
import Picture from '../Picture'
import { format } from 'timeago.js'
import { DesignDetailsPost } from '~/data/appDissections'
import { CenteredColumn } from '../Layouts'

interface Props {
  post: DesignDetailsPost
}

export default function DesignDetailView(props: Props) {
  const { post } = props

  const subheading = `Posted ${format(post.createdAt)} · ${
    post.details.length
  } details`

  return (
    <CenteredColumn>
      <div className="flex flex-col space-y-12">
        <div className="flex flex-col space-y-8">
          <Picture
            width={'64px'}
            height={'64px'}
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
            }}
            srcset={[
              `/static/img/design-details/${post.slug}.webp`,
              `/static/img/design-details/${post.slug}.jpeg`,
            ]}
            alt={post.title}
          />
          <div className="flex flex-col space-y-4">
            <h3>{post.title}</h3>
            <p className="p-small">{subheading}</p>
          </div>
          <Markdown>{post.description}</Markdown>
          {post.details.map((detail, i) => (
            <DesignDetailMedia detail={detail} key={`${detail.title}-${i}`} />
          ))}
        </div>
      </div>
    </CenteredColumn>
  )
}
