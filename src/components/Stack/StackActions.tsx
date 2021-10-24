import * as React from 'react'
import { UserRole, useViewerQuery } from '~/graphql/types.generated'
import Button from '~/components/Button'
import { EditStackDialog } from './EditStackDialog'

export function StackActions({ stack }) {
  const { data } = useViewerQuery()
  if (data?.viewer?.role === UserRole.Admin) {
    return <EditStackDialog stack={stack} trigger={<Button>Edit</Button>} />
  }

  return null
}
