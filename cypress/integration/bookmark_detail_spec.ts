/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Bookmark detail', () => {
  before(() => {
    cy.visit('/bookmarks/ckv43q5o11568w2aang3fmbts')
  })

  it('should render bookmarks list', () => {
    cy.get('[data-cy="bookmarks-list"]').should('be.visible')
  })

  it('should render bookmarks detail', () => {
    cy.get('[data-cy="bookmark-detail"]').should('be.visible')
  })

  it('should not render add bookmark button', () => {
    cy.get('[data-cy="open-add-bookmark-dialog"]').should('not.exist')
  })

  it('should not render add bookmark button', () => {
    cy.get('[data-cy="open-edit-bookmark-dialog"]').should('not.exist')
  })
})
