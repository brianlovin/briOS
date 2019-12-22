import * as React from 'react'
import { ContentGrid } from '~/components/Page'
import { H4, P, Rarr } from '~/components/Typography'
import { Card, PreviewImage, ReadingTime } from './style'

export default function FigmaPlugins() {
  return (
    <ContentGrid defaultColumns={4}>
      <a href="https://www.figma.com/c/plugin/744725347356614754/Dominant-Color-Toolkit-🎨" target="_blank" rel="noopener noreferrer">
        <Card style={{ height: '100%' }}>
          <PreviewImage alt="Dominant Color Toolkit" src={'/static/img/figma/dominant-color-toolkit.png'} />
          <H4 style={{ marginTop: 0 }}>Dominant Color Toolkit</H4>
          <P>Generate a palette from an image to magically populate your designs.</P>
          <ReadingTime>Install <Rarr /></ReadingTime>
        </Card>
      </a>

      <a href="https://www.figma.com/c/plugin/743654854885744527/Responsify-⚡%EF%B8%8F" target="_blank" rel="noopener noreferrer">
        <Card style={{ height: '100%' }}>
          <PreviewImage alt="Responsify" src={'/static/img/figma/responsify.png'} />
          <H4 style={{ marginTop: 0 }}>Responsify</H4>
          <P>Quickly test your designs across multiple device sizes.</P>
          <ReadingTime>Install <Rarr /></ReadingTime>
        </Card>
      </a>

      <a href="https://www.figma.com/c/plugin/747172434405306948/iOS-Export-Settings" target="_blank" rel="noopener noreferrer">
        <Card style={{ height: '100%' }}>
          <PreviewImage alt="iOS Export Settings" src={'/static/img/figma/ios-export-settings.png'} />
          <H4 style={{ marginTop: 0 }}>iOS Export Settings</H4>
          <P>Applies the correct export settings for every required iOS App Icon size and density.</P>
          <ReadingTime>Install <Rarr /></ReadingTime>
        </Card>
      </a>

      <a href="https://www.figma.com/c/plugin/747228167548695118/Export-.zip" target="_blank" rel="noopener noreferrer">
        <Card style={{ height: '100%' }}>
          <PreviewImage alt="Export .zip" src={'/static/img/figma/export-zip.png'} />
          <H4 style={{ marginTop: 0 }}>Export .zip</H4>
          <P>Easily export assets from Figma directly into a .zip file.</P>
          <ReadingTime>Install <Rarr /></ReadingTime>
        </Card>
      </a>
    </ContentGrid>
  )
}