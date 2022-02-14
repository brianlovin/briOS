/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('HN detail', () => {
  before(() => {
    cy.visit('/hn/28980382')
  })

  it('should render posts list', () => {
    cy.get('[data-cy="posts-list"]').should('be.visible')
    cy.get('[data-cy="post-detail"]').should('be.visible')
  })
})
