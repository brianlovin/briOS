// learned from https://samuelkraft.com/blog/segmented-control-framer-motion
import { AnimateSharedLayout, motion } from 'framer-motion'
import { useState } from 'react'

type Item = {
  id: string
  label: string
}

type SegmentedControlProps = {
  onSetActiveItem: Function
  items: Array<Item>
  active: String
}

const SegmentedControl = ({
  onSetActiveItem,
  items,
  active,
}: SegmentedControlProps): JSX.Element => {
  const [activeItem, setActiveitem] = useState(active)

  function onChange(i) {
    setActiveitem(items[i].id)
    onSetActiveItem(items[i].id)
  }

  return (
    <AnimateSharedLayout>
      <ol
        className={`flex p-1 bg-black dark:bg-white list-none bg-opacity-5 rounded-md`}
      >
        {items.map((item, i) => {
          const isActive = items[i].id === activeItem
          return (
            <motion.li
              className="relative flex-1 leading-none"
              whileTap={isActive ? { scale: 0.95 } : { opacity: 0.6 }}
              key={item.id}
            >
              <button
                onClick={() => onChange(i)}
                type="button"
                className={`relative text-xs font-semibold w-full px-4 py-1.5 leading-none bg-transparent cursor-pointer ${
                  isActive
                    ? `text-black dark:text-white text-opacity-100`
                    : `text-black dark:text-white text-opacity-60 hover:text-opacity-100`
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="SegmentedControlActive"
                    className="absolute top-0 bottom-0 left-0 right-0 bg-white rounded shadow-sm dark:bg-gray-700 z-1 content-none"
                  />
                )}
                <span className="relative z-2">{item.label}</span>
              </button>
            </motion.li>
          )
        })}
      </ol>
    </AnimateSharedLayout>
  )
}

export default SegmentedControl
