import { Switch as SwitchComponent } from '@headlessui/react'
import { useState } from 'react'

export function Switch({
  label = null,
  onChange = null,
  defaultEnabled = false,
}) {
  const [enabled, setEnabled] = useState(defaultEnabled)
  function handleChange() {
    onChange && onChange(!enabled)
    setEnabled(!enabled)
  }
  return (
    <SwitchComponent.Group>
      <div className="flex items-center">
        {label && (
          <SwitchComponent.Label className="text-primary mr-2 text-sm font-medium">
            {label}
          </SwitchComponent.Label>
        )}
        <SwitchComponent
          checked={enabled}
          onChange={handleChange}
          className={`${
            enabled ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
          } relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              enabled ? 'translate-x-5' : 'translate-x-1'
            } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
          />
        </SwitchComponent>
      </div>
    </SwitchComponent.Group>
  )
}
