import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Menu, X } from 'react-feather'
import { GlobalNavigationContext } from '~/components/Providers'

interface Props {
  title: string
  globalMenu?: boolean
  backButton?: boolean
  backButtonHref?: string
  magicTitle?: boolean
  titleRef?: React.MutableRefObject<HTMLParagraphElement>
  scrollContainerRef?: React.MutableRefObject<HTMLDivElement>
  children?: React.ReactNode
  leadingAccessory?: React.ReactNode
  trailingAccessory?: React.ReactNode
}

export default function TitleBar({
  title,
  globalMenu = true,
  backButton = false,
  backButtonHref,
  magicTitle = false,
  titleRef = null,
  scrollContainerRef = null,
  leadingAccessory = null,
  trailingAccessory = null,
  children,
}: Props) {
  const { isOpen, setIsOpen } = React.useContext(GlobalNavigationContext)

  const [offset, setOffset] = React.useState(200)
  const [opacity, _setOpacity] = React.useState(0)

  const [initialTitleOffsets, _setInitialTitleOffsets] = React.useState({
    top: 0,
    bottom: 0,
  })

  const initialTitleOffsetsRef = React.useRef(initialTitleOffsets)
  const setInitialTitleOffsets = (data) => {
    initialTitleOffsetsRef.current = data
    _setInitialTitleOffsets(data)
  }

  const opacityRef = React.useRef(opacity)
  const setOpacity = (data) => {
    opacityRef.current = data
    _setOpacity(data)
  }

  const handler = React.useCallback(() => {
    if (!titleRef?.current || !initialTitleOffsetsRef?.current) return

    const titleTop = titleRef.current.getBoundingClientRect().top - 48
    const titleBottom = titleRef.current.getBoundingClientRect().bottom - 56
    const initialOffsets = initialTitleOffsetsRef.current

    // when opacity is one, it's fully scrolled in
    if (titleBottom < initialOffsets.bottom * -1) return

    let offsetAmount =
      parseFloat((titleBottom / initialOffsets.bottom).toFixed(2)) * 100

    let opacityOffset =
      parseFloat((titleTop / initialOffsets.top).toFixed(2)) * -1

    setOffset(Math.min(Math.max(offsetAmount, 0), 100))
    setOpacity(opacityOffset)
  }, [title, titleRef])

  React.useEffect(() => {
    scrollContainerRef?.current?.addEventListener('scroll', handler)
    return () =>
      scrollContainerRef?.current?.removeEventListener('scroll', handler)
  }, [titleRef, scrollContainerRef])

  React.useEffect(() => {
    if (!titleRef?.current || !scrollContainerRef?.current) return

    scrollContainerRef.current.scrollTop = 0
    setOpacity(0)
    setInitialTitleOffsets({
      bottom: titleRef.current.getBoundingClientRect().bottom - 56,
      top: titleRef.current.getBoundingClientRect().top - 48,
    })
  }, [title, titleRef])

  return (
    <>
      <div className="sticky top-0 z-10 flex items-center flex-none px-3 py-2 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 h-14 bg-opacity-80 filter-blur">
        {globalMenu && (
          <span
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center p-2 rounded-md cursor-pointer lg:hidden hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            {isOpen ? (
              <X size={16} className="text-primary" />
            ) : (
              <Menu size={16} className="text-primary" />
            )}
          </span>
        )}

        {backButton && (
          <Link href={backButtonHref}>
            <a className="flex items-center justify-center p-2 rounded-md text-primary md:hidden hover:bg-gray-200">
              <ArrowLeft size={16} />
            </a>
          </Link>
        )}

        {leadingAccessory && <>{leadingAccessory}</>}

        <p
          style={
            magicTitle
              ? {
                  transform: `translateY(${offset}%)`,
                  opacity: `${opacity}`,
                }
              : {}
          }
          className="ml-3 text-sm font-semibold transform-gpu text-primary line-clamp-1"
        >
          {title}
        </p>
        {children}

        {trailingAccessory && <>{trailingAccessory}</>}
      </div>
    </>
  )
}
