/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Bookmarks index', () => {
  before(() => {
    cy.visit('/bookmarks')
  })

  it('should render header', () => {
    cy.get('[data-cy="bookmarks"]').scrollIntoView().should('be.visible')
  })
})
