import * as React from 'react'
import { A, P } from '~/components/Typography'
import Flex from '~/components/Flex'

export default function FigmaPlugins() {
  return (
    <Flex flexDirection="column" gap={16}>
      <Flex flexDirection="column" gap={4}>
        <A
          href="https://www.figma.com/c/plugin/744725347356614754/Dominant-Color-Toolkit-🎨"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dominant Color Toolkit
        </A>
        <P>
          Generate a palette from an image to magically populate your designs.
        </P>
      </Flex>

      <Flex flexDirection="column">
        <A
          href="https://www.figma.com/c/plugin/743654854885744527/Responsify-⚡%EF%B8%8F"
          target="_blank"
          rel="noopener noreferrer"
        >
          Responsify
        </A>
        <P>Quickly test your designs across multiple device sizes.</P>
      </Flex>

      <Flex flexDirection="column">
        <A
          href="https://www.figma.com/c/plugin/747172434405306948/iOS-Export-Settings"
          target="_blank"
          rel="noopener noreferrer"
        >
          iOS Export Settings
        </A>
        <P>
          Applies the correct export settings for every required iOS App Icon
          size and density.
        </P>
      </Flex>

      <Flex flexDirection="column">
        <A
          href="https://www.figma.com/c/plugin/747228167548695118/Export-.zip"
          target="_blank"
          rel="noopener noreferrer"
        >
          Export .zip
        </A>
        <P>Easily export assets from Figma directly into a .zip file.</P>
      </Flex>

      <Flex flexDirection="column">
        <A
          href="https://github.com/brianlovin/figma-github-data"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Data
        </A>
        <P>Populate data from GitHub into Figma mocks</P>
      </Flex>
    </Flex>
  )
}
