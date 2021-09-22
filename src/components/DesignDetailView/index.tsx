import React from 'react'
import DesignDetailMedia from '~/components/DesignDetailMedia'
import { MarkdownRenderer } from '~/components/MarkdownRenderer'
import { format } from 'timeago.js'
import { DesignDetailsPost } from '~/data/appDissections'
import { CenteredColumn } from '../Layouts'
import { PageHeader } from '../Page'
import Image from 'next/image'
import Link from 'next/link'

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
      <div className="space-y-8">
        <Link href="/app-dissection" passHref>
          <a className="leading-snug text-tertiary hover:text-gray-1000 dark:hover:text-gray-100">
            &larr; App Dissection
          </a>
        </Link>

        <div className="flex items-center space-x-4">
          <Image
            width={'72px'}
            height={'72px'}
            layout="fixed"
            className="rounded-xl"
            src={`/static/img/app-dissection/${post.slug}.webp`}
            alt={post.title}
          />
          <div>
            <PageHeader title={post.title} />
            <p className="text-tertiary align-self-center">{subheading}</p>
          </div>
        </div>

        <div className="flex flex-col space-y-12">
          <div className="prose">
            <MarkdownRenderer>{post.description}</MarkdownRenderer>
          </div>

          {post.details.map((detail, i) => (
            <DesignDetailMedia detail={detail} key={`${detail.title}-${i}`} />
          ))}
        </div>
      </div>
    </CenteredColumn>
  )
}
