/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Writing list', () => {
  before(() => {
    cy.visit('/writing')
  })

  it('should render posts list', () => {
    cy.get('[data-cy="posts-list"]').should('be.visible')
  })
})
