import React from 'react'
import { useDropzone } from 'react-dropzone'

import { CLOUDFLARE_IMAGE_DELIVERY_BASE_URL } from '~/lib/cloudflare'

import { ActiveDropzone } from './ActiveDropzone'

interface DropzoneProps {
  children: React.ReactNode
  onUploadStarted: () => void
  onUploadComplete: (url?: string) => void
  onUploadFailed: () => void
}

export function Dropzone(props: DropzoneProps) {
  const { children, onUploadComplete, onUploadStarted, onUploadFailed } = props

  async function getSignedUrl() {
    const data = await fetch('/api/images/sign').then((res) => res.json())
    return data?.uploadURL
  }

  async function uploadFile({ file, signedUrl }) {
    const data = new FormData()
    data.append('file', file)
    const upload = await fetch(signedUrl, {
      method: 'POST',
      body: data,
    }).then((r) => r.json())
    return upload?.result?.id
  }

  const onDropAccepted = React.useCallback(async (acceptedFiles: File[]) => {
    onUploadStarted()

    const file = acceptedFiles[0]
    const signedUrl = await getSignedUrl()

    if (!signedUrl) {
      onUploadFailed()
      return console.error('No signed url')
    }

    const id = await uploadFile({ file, signedUrl })
    if (!id) {
      onUploadFailed()
      return console.error('Upload failed')
    }

    const url = `${CLOUDFLARE_IMAGE_DELIVERY_BASE_URL}/${id}/public`
    return onUploadComplete(url)
  }, [])

  function onDropRejected() {
    alert('File rejected')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    noKeyboard: true,
    multiple: false,
    noClick: true,
    maxSize: 1000 * 1000 * 3, // 3mb
    accept: ['image/jpeg', 'image/png', 'image/gif'],
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? <ActiveDropzone /> : children}
    </div>
  )
}
