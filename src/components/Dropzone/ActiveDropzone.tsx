import React from 'react'
import { Upload } from 'react-feather'

export function ActiveDropzone() {
  return (
    <div className="filter-blur absolute inset-0 z-30 flex h-full w-full items-center justify-center bg-gray-200 bg-opacity-30 p-6">
      <div className="filter-blur flex h-full w-full flex-1 flex-col items-center justify-center space-y-6 rounded-xl border border-dashed border-gray-200 bg-white bg-opacity-80 px-8 text-center lg:px-16">
        <Upload className="text-secondary" size={32} />
        <div className="flex flex-col space-y-1">
          <p className="text-primary font-semibold">Drop a file here...</p>
        </div>
      </div>
    </div>
  )
}
