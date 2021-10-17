import * as React from 'react'
import Link from 'next/link'
import { Post } from '~/graphql/types.generated'
import { ArrowRight } from 'react-feather'

interface Props {
  posts: Post[]
}

export default function Writing({ posts }: Props) {
  if (!posts || posts.length === 0) return null

  function getFormattedDate(post) {
    return new Date(post.published_at).toLocaleDateString('en-us', {
      month: 'short',
      day: 'numeric',
    })
  }

  // function firstPost() {
  //   const post = posts[0]
  //   return (
  //     <Link href={`/writing/${post.slug}`}>
  //       <a className="-mb-2 rounded-t-lg hover:bg-white">
  //         <div className="flex flex-col px-8 py-6 space-y-3">
  //           <p className="text-quaternary">{getFormattedDate(post)}</p>
  //           <p className="text-2xl font-bold text-primary">{post.title}</p>
  //           <p className="text-xl text-tertiary">{post.excerpt}</p>
  //         </div>
  //       </a>
  //     </Link>
  //   )
  // }

  function morePosts() {
    // const list = posts.slice(1)

    return (
      <div className="px-2 pt-0.5 pb-0">
        {posts.map((post, index) => {
          const date = getFormattedDate(post)

          return (
            <div className="space-y-1" key={post.id}>
              <Link
                href="/writing/[slug]"
                as={`/writing/${post.slug}`}
                passHref
              >
                <a className="transition-all block transform-gpu rounded-md shadow-none hover:-translate-y-0.5 text-primary hover:bg-white hover:shadow-sm dark:hover:bg-gray-800">
                  <div className="grid grid-cols-8 gap-4 px-6 py-4">
                    <p className="col-span-1 text-quaternary">{date}</p>
                    <div className="flex flex-col col-span-7 space-y-1">
                      <p className="font-medium">{post.title}</p>
                      <p className="text-tertiary">{post.excerpt}</p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid gap-2 pt-2 bg-gray-200 bg-opacity-50 rounded-lg">
      {/* {firstPost()} */}

      {/* <div className="border-t border-gray-300" /> */}
      {/* 
      <div className="flex flex-col px-6 py-6 m-4 -my-2 space-y-2 rounded shadow bg-gray-50">
        <p className="font-semibold text-primary">The email newsletter</p>
        <p className="text-tertiary">
          Get updates about new posts, new projects, or other meaningful updates
          to this site delivered to your inbox. Alternatively, you can{' '}
          <a
            href="https://twitter.com/brian_lovin/"
            className="font-normal rounded-sm px-0.5 -mx-0.5 bg-blue-500 text-primary bg-opacity-20 hover:bg-opacity-30 dark:hover:bg-opacity-100"
          >
            follow me on Twitter
          </a>
          .
        </p>
        <NewsletterSubscriptionBox />
      </div> */}

      {morePosts()}

      <Link href="/writing">
        <a className="transition-all mx-2 mb-2 transform-gpu rounded hover:-translate-y-0.5 shadow-none text-tertiary hover:bg-white hover:shadow-sm dark:hover:bg-gray-800">
          <div className="flex justify-between px-6 py-4 space-y-1">
            <p className="font-medium">View all </p>
            <p className="text-quaternary">
              <ArrowRight size={16} />
            </p>
          </div>
        </a>
      </Link>
    </div>
  )
}
