/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Adding a question', () => {
  before(() => {
    cy.visit('/ama')
  })

  it('should render questions list', () => {
    cy.get('[data-cy="questions-list"]').should('be.visible')
    cy.get('[data-cy="open-add-question-dialog"]').should('be.visible')
    cy.get('[data-cy="open-add-question-dialog"]').click()
    cy.get('[data-cy="sign-in-dialog"]').should('be.visible')
  })
})
