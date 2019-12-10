import * as React from 'react';
import Link from 'next/link'
import Page, { SectionHeading, ContentContainer } from '~/components/Page';
import { H1, P, Larr, Subheading } from '~/components/Typography'

export default function About() {
  return (
    <Page withHeader>
      <ContentContainer>
        <SectionHeading>
          <H1>About me</H1>
          
          <div style={{ padding: '16px' }} />

          <P>👋 I'm a product designer, podcaster, and writer, living in New York City.</P>
          <P>I'm currently designing <a href="https://github.com/mobile" target="_blank" rel="noopener noreferrer">native mobile apps</a> at <a href="https://github.com/brianlovin" target="_blank" rel="noopener noreferrer">GitHub</a>. Before GitHub, I co-founded <a href="https://spectrum.chat" target="_blank" rel="noopener noreferrer">Spectrum</a>, a platform for large-scale communities to have better public conversations. Spectrum was acquired by GitHub in November, 2018.</P>
          <P>Before Spectrum I designed payments experiences at Facebook, working across Facebook, Messenger, WhatsApp, and Instagram. I originally cut my teeth as the first product designer at <a href="https://buffer.com" target="_blank" rel="noopener noreferrer">Buffer</a>.</P>
          <P>I also co-host the <a href="https://designdetails.fm" target="_blank" rel="noopener noreferrer">Design Details Podcast</a>, a weekly conversation about design process and culture. Design Details is part of <a href="https://spec.fm" target="_blank" rel="noopener noreferrer">Spec.fm</a>, a podcast network for designers and developers, which I co-founded in 2015.</P>
          <P>You can find me on <a href="https://twitter.com/brian_lovin" target="_blank" rel="noopener noreferrer">Twitter</a> where I talk about design and development, or on <a href="https://github.com/brianlovin" target="_blank" rel="noopener noreferrer">GitHub</a> where I'm building in the open, or on <a href="https://figma.com/@brian" target="_blank" rel="noopener noreferrer">Figma</a> where I'm exploring how plugins can automate the tedious parts of interface design.</P>
        
        </SectionHeading>
      </ContentContainer>
    </Page>
  );
}
