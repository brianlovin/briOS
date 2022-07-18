import {
  ResultOf,
  TypedDocumentNode,
  VariablesOf,
} from '@graphql-typed-document-node/core'
import got from 'got'
import { ExecutionResult, print } from 'graphql'

import { ViewerDocument } from './generated/types'

export type Json =
  | boolean
  | string
  | number
  | null
  | Json[]
  | { [key: string]: Json }

export const commitGraphQLOperation = async <T extends TypedDocumentNode>(
  query: T,
  variables: VariablesOf<T>
): Promise<ExecutionResult<ResultOf<T>, Record<string, Json>>> => {
  try {
    const response = await got({
      json: {
        query: print(query),
        variables,
      },
      responseType: 'json',
      url: 'http://localhost:3000/api/graphql',
      method: 'POST',
    })

    return response.body
  } catch (e) {
    throw e
  }
}

it('verifies that an unauthenticated user does not have admin privileges', async () => {
  const { data } = await commitGraphQLOperation(ViewerDocument, {})

  expect(Boolean(data.viewer?.isAdmin)).toBe(false)
})
