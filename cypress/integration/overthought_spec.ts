/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Posts index', () => {
  before(() => {
    cy.visit('/writing')
  })

  it('should render header', () => {
    cy.get('[data-cy="writing"]').scrollIntoView().should('be.visible')
  })

  it('should render newsletter', () => {
    cy.get('[data-cy="writing-subscribe-box"]')
      .scrollIntoView()
      .should('be.visible')
  })
})
