import React from 'react'
import { useRouter } from 'next/router'
import FullscreenLoading from '~/components/FullscreenLoading'

export default function Journal() {
  const router = useRouter()
  React.useEffect(() => {
    router.push('/overthought')
  }, [])

  return <FullscreenLoading />
}
