/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('HN list', () => {
  before(() => {
    cy.visit('/hn')
  })

  it('should render posts list', () => {
    cy.get('[data-cy="posts-list"]').should('be.visible')
  })
})
