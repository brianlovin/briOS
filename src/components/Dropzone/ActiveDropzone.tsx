import React from 'react'
import { Upload } from 'react-feather'

export function ActiveDropzone() {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center w-full h-full p-6 bg-gray-200 filter-blur bg-opacity-30">
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full px-8 space-y-6 text-center bg-white border border-gray-200 border-dashed bg-opacity-80 rounded-xl filter-blur lg:px-16">
        <Upload className="text-secondary" size={32} />
        <div className="flex flex-col space-y-1">
          <p className="font-semibold text-primary">Drop a file here...</p>
        </div>
      </div>
    </div>
  )
}
