import React from 'react'
import DesignDetailMedia from '~/components/DesignDetailMedia'
import Markdown from '~/components/MarkdownRenderer'
import Picture from '../Picture'
import { format } from 'timeago.js'
import { DesignDetailsPost } from '~/data/appDissections'
import { CenteredColumn } from '../Layouts'
import { PageHeader } from '../Page'
import Image from 'next/image'

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
        <div className="flex flex-col space-y-8 md:items-center">
          <Image
            width={'64px'}
            height={'64px'}
            layout="fixed"
            className="rounded-xl"
            src={`/static/img/design-details/${post.slug}.webp`}
            alt={post.title}
          />
          <div className="flex flex-col space-y-2">
            <PageHeader title={post.title} />
            <p className="p-small align-self-center">{subheading}</p>
          </div>
        </div>

        <Markdown>{post.description}</Markdown>

        {post.details.map((detail, i) => (
          <DesignDetailMedia detail={detail} key={`${detail.title}-${i}`} />
        ))}
      </div>
    </CenteredColumn>
  )
}
