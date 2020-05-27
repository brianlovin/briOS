import * as React from 'react'
import styled from 'styled-components'
import Page from '~/components/Page'
import { P, H5 } from '~/components/Typography'
import theme from '~/components/Theme'
import Picture from '~/components/Picture'
import { withApollo } from '~/components/withApollo'
import { initApolloClient } from '~/graphql/services/apollo'
import { GET_AMA_QUESTIONS } from '~/graphql/queries/ama'
import AMAQuestions from '~/components/AMAQuestions'
import Flex from '~/components/Flex'
import { CenteredColumn } from '~/components/Layouts'
import GlobalMarkdownStyles from '~/components/GlobalStyles/markdown'

const Container = styled.div`
  picture {
    margin-top: ${theme.space[5]};
    margin-bottom: 32px;
    object-fit: cover;
    display: block;
    margin-left: -16px;
    margin-right: -16px;
    width: calc(100% + 32px);

    @media (max-width: ${theme.breakpoints[4]}) {
      margin-top: -78px;
    }
  }

  img {
    width: 100%;
    border-radius: 8px;
    aspect-ratio: attr(width) / attr(height);

    @media (max-width: ${theme.breakpoints[4]}) {
      border-radius: 0;
    }
  }
`

function About() {
  return (
    <Page withHeader>
      <GlobalMarkdownStyles />
      <CenteredColumn>
        <Container data-cy="about-page">
          <Picture
            srcset={['/static/img/about.webp', '/static/img/about.jpg']}
            alt={'A photo of me'}
            width={'640px'}
            height={'auto'}
            lazy={false}
          />
        </Container>
        <Flex flexDirection="column" gap={48}>
          <Flex flexDirection="column" gap={16}>
            <P>
              👋 I’m a product designer, podcaster, and writer, currently living
              in San Francisco.
            </P>
            <P>
              Right now I’m designing{' '}
              <a
                href="https://github.com/mobile"
                target="_blank"
                rel="noopener noreferrer"
              >
                native mobile apps
              </a>{' '}
              at{' '}
              <a
                href="https://github.com/brianlovin"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              . Before GitHub, I co-founded{' '}
              <a
                href="https://spectrum.chat"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spectrum
              </a>
              , a platform for large-scale communities to have better public
              conversations. Spectrum was acquired by GitHub in November, 2018.
            </P>
            <P>
              Before Spectrum I designed payments experiences at Facebook,
              working across Facebook, Messenger, WhatsApp, and Instagram. I
              originally cut my teeth as the first product designer at{' '}
              <a
                href="https://buffer.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Buffer
              </a>
              .
            </P>
            <P>
              I also co-host the{' '}
              <a
                href="https://designdetails.fm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Design Details Podcast
              </a>
              , a weekly conversation about design process and culture. Design
              Details is part of{' '}
              <a
                href="https://spec.fm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spec.fm
              </a>
              , a podcast network for designers and developers, which I
              co-founded in 2015.
            </P>
            <P>
              You can find me on{' '}
              <a
                href="https://twitter.com/brian_lovin"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>{' '}
              where I talk about design and development, or on{' '}
              <a
                href="https://github.com/brianlovin"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>{' '}
              where I’m building in the open, or on{' '}
              <a
                href="https://figma.com/@brian"
                target="_blank"
                rel="noopener noreferrer"
              >
                Figma
              </a>{' '}
              where I’m exploring how plugins can automate the tedious parts of
              interface design.
            </P>
            <P>
              <em>
                Photo by{' '}
                <a
                  href="https://twitter.com/rxnjmmt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @rxnjmmt
                </a>
              </em>
            </P>
          </Flex>
          <Flex flexDirection="column" gap={16}>
            <H5>Ask Me Anything</H5>
            <P>Just for fun! Questions will be visible after I’ve answered.</P>
            <AMAQuestions />
          </Flex>
        </Flex>
      </CenteredColumn>
    </Page>
  )
}

export async function getStaticProps() {
  const client = await initApolloClient({})
  await client.query({
    query: GET_AMA_QUESTIONS,
    variables: { status: 'ANSWERED' },
  })
  /*
    Because this is using withApollo, the data from this query will be
    pre-populated in the Apollo cache at build time. When the user first
    visits this page, we can retreive the data from the cache like this:

    const { data } = useGetBookmarksQuery({ fetchPolicy: 'cache-and-network' })

    This preserves the ability for the page to render all bookmarks instantly,
    then get progressively updated if any new bookmarks come in over the wire.
  */
  const apolloStaticCache = client.cache.extract()
  return {
    // because this data is slightly more dynamic, update it every hour
    unstable_revalidate: 60 * 60,
    props: {
      apolloStaticCache,
    },
  }
}

export default withApollo(About)
