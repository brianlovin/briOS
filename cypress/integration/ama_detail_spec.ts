/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('AMA detail', () => {
  before(() => {
    cy.visit('/ama/ckv5gvob02266luaa887jb0na')
  })

  it('should render questions list', () => {
    cy.get('[data-cy="questions-list"]').should('be.visible')
    cy.get('[data-cy="question-detail"]').should('be.visible')
    cy.get('[data-cy="pending-filter-button"]').should('not.exist')
  })
})
