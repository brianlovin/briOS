/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('App dissection post', () => {
  before(() => {
    cy.visit('/app-dissection/neubible-ios')
  })

  it('should render apps list', () => {
    cy.get('[data-cy="apps-list"]').should('be.visible')
  })

  it('should render app detail', () => {
    cy.get('[data-cy="app-detail"]').should('be.visible')
  })
})
