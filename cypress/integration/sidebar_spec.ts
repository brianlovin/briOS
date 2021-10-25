/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Sidebar', () => {
  before(() => {
    cy.visit('/')
  })

  it('should render sign in button', () => {
    cy.get('[data-cy="sign-in-button"]').should('be.visible')
  })
})
