import * as React from 'react'
import { Ul, Li } from '~/components/Typography'

export default function FigmaPlugins() {
  return (
    <Ul style={{ listStyleType: 'none', marginLeft: 0 }}>
      <Li>
        <a
          href="https://www.figma.com/c/plugin/744725347356614754/Dominant-Color-Toolkit-🎨"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dominant Color Toolkit
        </a>
        <div>
          Generate a palette from an image to magically populate your designs.
        </div>
      </Li>

      <Li>
        <a
          href="https://www.figma.com/c/plugin/743654854885744527/Responsify-⚡%EF%B8%8F"
          target="_blank"
          rel="noopener noreferrer"
        >
          Responsify
        </a>
        <div>Quickly test your designs across multiple device sizes.</div>
      </Li>

      <Li>
        <a
          href="https://www.figma.com/c/plugin/747172434405306948/iOS-Export-Settings"
          target="_blank"
          rel="noopener noreferrer"
        >
          iOS Export Settings
        </a>
        <div>
          Applies the correct export settings for every required iOS App Icon
          size and density.
        </div>
      </Li>

      <Li>
        <a
          href="https://www.figma.com/c/plugin/747228167548695118/Export-.zip"
          target="_blank"
          rel="noopener noreferrer"
        >
          Export .zip
        </a>
        <div>Easily export assets from Figma directly into a .zip file.</div>
      </Li>

      <Li>
        <a
          href="https://github.com/brianlovin/figma-github-data"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Data
        </a>
        <div>Populate data from GitHub into Figma mocks</div>
      </Li>
    </Ul>
  )
}
