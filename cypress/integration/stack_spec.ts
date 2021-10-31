/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Stack list', () => {
  before(() => {
    cy.visit('/stack')
  })

  it('should render stack list', () => {
    cy.get('[data-cy="stack-list"]').should('be.visible')
  })
})
