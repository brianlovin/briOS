import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

export default function FigmaPlugins() {
  const plugins = [
    {
      url: 'https://www.figma.com/c/plugin/744725347356614754/Dominant-Color-Toolkit-🎨',
      name: 'Dominant Color Toolkit',
      description:
        'Generate a palette from an image to magically populate your designs.',
      image: `dominant-color-toolkit.png`,
    },
    {
      url: 'https://www.figma.com/c/plugin/743654854885744527/Responsify-⚡%EF%B8%8F',
      name: 'Responsify',
      description: 'Quickly test your designs across multiple device sizes.',
      image: `responsify.png`,
    },
    {
      url: 'https://www.figma.com/c/plugin/747172434405306948/iOS-Export-Settings',
      name: 'iOS Export Settings',
      description:
        'Applies the correct export settings for every required iOS App Icon size and density.',
      image: `ios-export-settings.png`,
    },
    {
      url: 'https://www.figma.com/c/plugin/747228167548695118/Export-.zip',
      name: 'Export .zip',
      description: 'Easily export assets from Figma directly into a .zip file.',
      image: `export-zip.png`,
    },
  ]

  return (
    <div>
      <div className="px-8 pb-6 space-y-2">
        <p className="text-3xl font-bold text-primary">Figma plugins</p>
        <p className="text-xl text-tertiary">
          Automating the boring parts of product design.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {plugins.map((plugin) => (
          <Link key={plugin.name} passHref href={plugin.url}>
            <a className="h-full transition-all hover:shadow-md transform-gpu hover:-translate-y-0.5 bg-white rounded-lg shadow-sm dark:bg-gray-900 dark:hover:bg-gray-800">
              <Image
                className="w-full rounded-t-lg filter-saturate"
                alt={plugin.description}
                src={`/static/img/figma-plugins/${plugin.image}`}
                width={372}
                height={186}
                layout={'responsive'}
              />

              <div className="px-6 py-4 space-y-1">
                <p className="font-medium text-primary">{plugin.name}</p>

                <p className="text-tertiary">{plugin.description}</p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}
