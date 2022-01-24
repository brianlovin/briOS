import { Listbox } from '@headlessui/react'
import * as React from 'react'
import { ChevronDown } from 'react-feather'

import { useGetTagsQuery } from '~/graphql/types.generated'

import { Tag } from '.'

export function TagPicker({ filter, onChange, defaultValue = undefined }) {
  const { data, loading } = useGetTagsQuery()
  const [selected, setSelected] = React.useState(defaultValue)

  if (loading) return null

  function handleChange(val) {
    setSelected(val)
    onChange(val)
  }

  return (
    <Listbox value={selected} onChange={handleChange}>
      <div className="relative z-10 mt-1">
        <Listbox.Button
          className={`relative w-full cursor-pointer rounded-md border border-gray-200 bg-white bg-opacity-5 py-2.5 pl-4 pr-10 text-left shadow-sm dark:border-gray-700 dark:bg-white ${
            selected ? 'text-primary' : 'text-quaternary'
          }`}
        >
          {selected ? <>{selected}</> : 'Choose a tag...'}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown size={16} aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white text-base shadow-sm dark:border-gray-700 dark:bg-gray-700">
          <div className="flex flex-wrap p-2">
            {data.tags
              .filter((t) => (filter ? filter(t) : true))
              .map((tag) => (
                <Listbox.Option
                  key={tag.name}
                  className={`text-primary relative flex flex-none cursor-pointer select-none p-1`}
                  value={tag.name}
                >
                  <Tag name={tag.name} />
                </Listbox.Option>
              ))}
          </div>
          <div className="w-full border-t border-gray-150 p-2 dark:border-gray-600">
            <Listbox.Option
              className={`text-primary relative flex flex-none cursor-pointer select-none p-1`}
              value={null}
            >
              <Tag name={'__clear_tag_picker'} />
            </Listbox.Option>
          </div>
        </Listbox.Options>
      </div>
    </Listbox>
  )
}
