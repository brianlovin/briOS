/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('App dissection list', () => {
  before(() => {
    cy.visit('/app-dissection')
  })

  it('should render apps list', () => {
    cy.get('[data-cy="apps-list"]').should('be.visible')
  })
})
