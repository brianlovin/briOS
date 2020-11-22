import * as React from 'react'

export default function FigmaPlugins() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-1">
        <a
          href="https://www.figma.com/c/plugin/744725347356614754/Dominant-Color-Toolkit-🎨"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dominant Color Toolkit
        </a>
        <p>
          Generate a palette from an image to magically populate your designs.
        </p>
      </div>

      <div className="flex flex-col">
        <a
          href="https://www.figma.com/c/plugin/743654854885744527/Responsify-⚡%EF%B8%8F"
          target="_blank"
          rel="noopener noreferrer"
        >
          Responsify
        </a>
        <p>Quickly test your designs across multiple device sizes.</p>
      </div>

      <div className="flex flex-col">
        <a
          href="https://www.figma.com/c/plugin/747172434405306948/iOS-Export-Settings"
          target="_blank"
          rel="noopener noreferrer"
        >
          iOS Export Settings
        </a>
        <p>
          Applies the correct export settings for every required iOS App Icon
          size and density.
        </p>
      </div>

      <div className="flex flex-col">
        <a
          href="https://www.figma.com/c/plugin/747228167548695118/Export-.zip"
          target="_blank"
          rel="noopener noreferrer"
        >
          Export .zip
        </a>
        <p>Easily export assets from Figma directly into a .zip file.</p>
      </div>

      <div className="flex flex-col">
        <a
          href="https://github.com/brianlovin/figma-github-data"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Data
        </a>
        <p>Populate data from GitHub into Figma mocks</p>
      </div>
    </div>
  )
}
