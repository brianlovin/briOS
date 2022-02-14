/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Bookmarks list', () => {
  before(() => {
    cy.visit('/bookmarks')
  })

  it('should render bookmarks list', () => {
    cy.get('[data-cy="bookmarks-list"]').should('be.visible')
    cy.get('[data-cy="open-add-bookmark-dialog"]').should('not.exist')
  })
})
