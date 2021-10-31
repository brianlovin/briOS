/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Home page', () => {
  before(() => {
    cy.visit('/')
  })

  it('should render intro', () => {
    cy.get('[data-cy="home-intro"]').should('be.visible')
  })
})
