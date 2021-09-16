// learned from https://samuelkraft.com/blog/segmented-control-framer-motion
import { useState } from 'react'
import { motion, AnimateSharedLayout } from 'framer-motion'

type Tint = {
  light: string
  dark: string
}

type Text = {
  active: string
  inactive: string
}

type Item = {
  id: string
  label: string
}

type SegmentedControlProps = {
  onSetActiveItem: Function
  items: Array<Item>
  tint?: Tint
  text?: Text
}

const SegmentedControl = ({
  onSetActiveItem,
  items,
  tint = { light: 'bg-gray-1000', dark: 'bg-white' },
  text = { active: 'text-gray-1000', inactive: 'text-gray-1000' },
}: SegmentedControlProps): JSX.Element => {
  const [activeItem, setActiveitem] = useState(0)

  function onChange(i) {
    setActiveitem(i)
    onSetActiveItem(items[i].id)
  }

  return (
    <AnimateSharedLayout>
      <ol
        className={`flex p-1 list-none ${tint.light} dark:${tint.dark} bg-opacity-10 rounded-full`}
      >
        {items.map((item, i) => {
          const isActive = i === activeItem
          return (
            <motion.li
              className="relative flex-1 leading-none"
              whileTap={isActive ? { scale: 0.95 } : { opacity: 0.6 }}
              key={item.id}
            >
              <button
                onClick={() => onChange(i)}
                type="button"
                className={`relative w-full px-8 py-2 leading-none bg-transparent cursor-pointer ${
                  isActive
                    ? `${text.active} text-opacity-100`
                    : `${text.inactive} text-opacity-80 hover:text-opacity-100`
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="SegmentedControlActive"
                    className="absolute top-0 bottom-0 left-0 right-0 bg-white rounded-full shadow-sm z-1 content-none"
                  />
                )}
                <span className="relative font-medium z-2">{item.label}</span>
              </button>
            </motion.li>
          )
        })}
      </ol>
    </AnimateSharedLayout>
  )
}

export default SegmentedControl
