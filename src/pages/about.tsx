import * as React from 'react'
import styled from 'styled-components'
import Page, { ContentContainer } from '~/components/Page'
import { P } from '~/components/Typography'
import theme from '~/components/Theme'
import Picture from '~/components/Picture'
import Grid from '~/components/Grid'

const Container = styled.div`
  width: calc(100% + 32px);
  margin-left: -16px;
  margin-right: -16px;

  picture {
    width: 100%;
    margin-top: ${theme.space[5]};
    object-fit: cover;
    display: block;

    @media (max-width: ${theme.breakpoints[4]}) {
      margin-top: -78px;
      margin-left: -16px;
      margin-right: -16px;
      width: calc(100% + 32px);
    }
  }

  source,
  img {
    width: 100%;
    border-radius: 8px;

    @media (max-width: ${theme.breakpoints[4]}) {
      border-radius: 0;
    }
  }
`

export default function About() {
  return (
    <Page withHeader>
      <Grid columns={'fit-content(640px)'} style={{ justifyContent: 'center' }}>
        <Grid gap={48}>
          <Container data-cy="about-page">
            <Picture
              srcset={['/static/img/about.webp', '/static/img/about.jpg']}
              alt={'A photo of me'}
            />
          </Container>
          <ContentContainer>
            <Grid gap={16}>
              <P>
                👋 I’m a product designer, podcaster, and writer, currently
                living in San Francisco. Let’s grab a coffee.
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
                conversations. Spectrum was acquired by GitHub in November,
                2018.
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
                where I’m exploring how plugins can automate the tedious parts
                of interface design.
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
            </Grid>
          </ContentContainer>
        </Grid>
      </Grid>
    </Page>
  )
}
