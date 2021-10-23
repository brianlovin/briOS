import * as React from 'react'
import { Listbox } from '@headlessui/react'
import { useGetTagsQuery } from '~/graphql/types.generated'
import { Tag } from '.'
import { ChevronDown } from 'react-feather'

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
        <Listbox.Button className="cursor-pointer relative w-full py-2.5 pl-4 pr-10 text-left bg-white shadow-sm border border-gray-200 dark:border-gray-700 rounded-md dark:bg-white bg-opacity-5 text-quaternary">
          {selected ? <Tag name={selected} /> : 'Choose a tag...'}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown size={16} aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute w-full mt-1 overflow-auto text-base bg-white border border-gray-200 rounded-md shadow-sm dark:border-gray-700 dark:bg-gray-700 max-h-60">
          <div className="flex flex-wrap p-2">
            {data.tags
              .filter((t) => (filter ? filter(t) : true))
              .map((tag) => (
                <Listbox.Option
                  key={tag.name}
                  className={`flex p-1 flex-none cursor-pointer text-primary select-none relative`}
                  value={tag.name}
                >
                  <Tag name={tag.name} />
                </Listbox.Option>
              ))}
          </div>
          <div className="w-full p-2 border-t border-gray-150 dark:border-gray-600">
            <Listbox.Option
              className={`flex flex-none cursor-pointer text-primary p-1 select-none relative`}
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
