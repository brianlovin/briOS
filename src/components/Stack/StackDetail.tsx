import Image from 'next/image'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import * as React from 'react'
import { Link as LinkIcon } from 'react-feather'

import { PrimaryButton } from '~/components/Button'
import { Campsite } from '~/components/Campsite'
import { Comments } from '~/components/Comments'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { Tags } from '~/components/Tag'
import routes from '~/config/routes'
import { CommentType, useGetStackQuery } from '~/graphql/types.generated'

import { MarkdownRenderer } from '../MarkdownRenderer'
import { SignInDialog } from '../SignInDialog'
import { StackActions } from './StackActions'
import { StackUsedBy } from './StackUsedBy'

export function StackDetail({ slug }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  const { data, loading, error } = useGetStackQuery({
    variables: { slug },
  })

  if (loading) {
    return <Detail.Loading />
  }

  if (!data?.stack || error) {
    return <Detail.Null />
  }

  const { stack } = data

  return (
    <>
      <NextSeo
        title={stack.name}
        description={stack.description}
        openGraph={{
          title: stack.name,
          description: stack.description,
          images: [
            {
              url: routes.stack.seo.image,
              alt: routes.stack.seo.description,
            },
          ],
        }}
      />
      <Detail.Container data-cy="stack-detail" ref={scrollContainerRef}>
        <TitleBar
          backButton
          globalMenu={false}
          backButtonHref={'/stack'}
          magicTitle
          title={stack.name}
          titleRef={titleRef}
          scrollContainerRef={scrollContainerRef}
          trailingAccessory={<StackActions stack={stack} />}
        />

        <Detail.ContentContainer>
          <Detail.Header>
            <div className="flex items-center space-x-6">
              <Link href={stack.url} className="inline-block">
                <Image
                  priority
                  src={stack.image}
                  width={80}
                  height={80}
                  layout="fixed"
                  alt={`${stack.name} icon`}
                  className={'rounded-2xl'}
                />
              </Link>
              <div className="flex flex-col space-y-1">
                <Link href={stack.url} className="block">
                  <Detail.Title ref={titleRef}>{stack.name}</Detail.Title>
                </Link>
                {stack.tags && stack.tags.length > 0 && (
                  <Tags tags={stack.tags} />
                )}
              </div>
            </div>

            <MarkdownRenderer
              className="prose text-primary"
              children={stack.description}
              variant="comment"
            />

            <PrimaryButton
              size="large"
              href={stack.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkIcon size={14} />
              <span>Visit</span>
            </PrimaryButton>

            <SignInDialog>
              {({ openModal }) => (
                <StackUsedBy triggerSignIn={openModal} stack={stack} />
              )}
            </SignInDialog>

            <div className="justify-center flex">
              <div className="w-full max-w-3xl mx-auto">
                <Campsite referrer="/stack" />
              </div>
            </div>
          </Detail.Header>
        </Detail.ContentContainer>

        <Comments refId={stack.id} type={CommentType.Stack} />
      </Detail.Container>
    </>
  )
}
