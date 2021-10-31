/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('About page', () => {
  before(() => {
    cy.visit('/about')
  })

  it('should render intro', () => {
    cy.get('[data-cy="home-intro"]').should('be.visible')
  })
})
