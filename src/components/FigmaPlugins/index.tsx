import * as React from 'react'

export default function FigmaPlugins() {
  return (
    <>
      <div className="space-y-1 ">
        <span>
          <a
            className="font-medium text-primary highlight-link-hover"
            href="https://www.figma.com/c/plugin/744725347356614754/Dominant-Color-Toolkit-🎨"
          >
            Dominant Color Toolkit
          </a>
        </span>
        <p className="text-tertiary clamp-3">
          Generate a palette from an image to magically populate your designs.
        </p>
      </div>

      <div className="">
        <span>
          <a
            className="font-medium text-primary highlight-link-hover"
            href="https://www.figma.com/c/plugin/743654854885744527/Responsify-⚡%EF%B8%8F"
          >
            Responsify
          </a>
        </span>
        <p className="text-tertiary clamp-3">
          Quickly test your designs across multiple device sizes.
        </p>
      </div>

      <div className="">
        <span>
          <a
            className="font-medium text-primary highlight-link-hover"
            href="https://www.figma.com/c/plugin/747172434405306948/iOS-Export-Settings"
          >
            iOS Export Settings
          </a>
        </span>
        <p className="text-tertiary clamp-3">
          Applies the correct export settings for every required iOS App Icon
          size and density.
        </p>
      </div>

      <div className="">
        <span>
          <a
            className="font-medium text-primary highlight-link-hover"
            href="https://www.figma.com/c/plugin/747228167548695118/Export-.zip"
          >
            Export .zip
          </a>
        </span>
        <p className="text-tertiary clamp-3">
          Easily export assets from Figma directly into a .zip file.
        </p>
      </div>

      <div className="">
        <span>
          <a
            className="font-medium text-primary highlight-link-hover"
            href="https://github.com/brianlovin/figma-github-data"
          >
            GitHub Data
          </a>
        </span>
        <p className="text-tertiary clamp-3">
          Populate data from GitHub into Figma mocks
        </p>
      </div>
    </>
  )
}
