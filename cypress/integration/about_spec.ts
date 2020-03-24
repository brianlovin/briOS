/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('About', () => {
  before(() => {
    cy.visit('/about')
  })

  it('should render about', () => {
    cy.get('[data-cy="about-page"]').should('be.visible')
  })
})
