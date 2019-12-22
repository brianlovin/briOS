import * as React from 'react'
import { ContentGrid } from '~/components/Page'
import { H5, P, Rarr } from '~/components/Typography'
import { Card, ReadingTime } from './style'

export default function FigmaPlugins() {
  return (
    <ContentGrid defaultColumns={4}>
      <a href="https://www.figma.com/c/plugin/744725347356614754/Dominant-Color-Toolkit-🎨" target="_blank" rel="noopener noreferrer">
        <Card style={{ height: '100%' }}>
          <H5 style={{ marginTop: 0 }}>Dominant Color Toolkit</H5>
          <P>Generate a palette from an image to magically populate your designs.</P>
          <ReadingTime>Install <Rarr /></ReadingTime>
        </Card>
      </a>

      <a href="https://www.figma.com/c/plugin/743654854885744527/Responsify-⚡%EF%B8%8F" target="_blank" rel="noopener noreferrer">
        <Card style={{ height: '100%' }}>
          <H5 style={{ marginTop: 0 }}>Responsify</H5>
          <P>Quickly test your designs across multiple device sizes.</P>
          <ReadingTime>Install <Rarr /></ReadingTime>
        </Card>
      </a>

      <a href="https://www.figma.com/c/plugin/747172434405306948/iOS-Export-Settings" target="_blank" rel="noopener noreferrer">
        <Card style={{ height: '100%' }}>
          <H5 style={{ marginTop: 0 }}>iOS Export Settings</H5>
          <P>Applies the correct export settings for every required iOS App Icon size and density.</P>
          <ReadingTime>Install <Rarr /></ReadingTime>
        </Card>
      </a>

      <a href="https://www.figma.com/c/plugin/747228167548695118/Export-.zip" target="_blank" rel="noopener noreferrer">
        <Card style={{ height: '100%' }}>
          <H5 style={{ marginTop: 0 }}>Export .zip</H5>
          <P>Easily export assets from Figma directly into a .zip file.</P>
          <ReadingTime>Install <Rarr /></ReadingTime>
        </Card>
      </a>
    </ContentGrid>
  )
}