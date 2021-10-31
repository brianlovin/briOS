/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('AMA list', () => {
  before(() => {
    cy.visit('/ama')
  })

  it('should render questions list', () => {
    cy.get('[data-cy="questions-list"]').should('be.visible')
  })
})
