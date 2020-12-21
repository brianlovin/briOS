/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import stacks from '../../src/components/Stack/data'

describe('Stack', () => {
  before(() => {
    cy.visit('/stack')
  })

  it('should render stacks', () => {
    stacks.map((stack) => {
      cy.contains(stack.name)
      cy.contains(stack.description)
    })
  })
})
