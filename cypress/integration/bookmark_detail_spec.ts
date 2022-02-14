/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Bookmark detail', () => {
  before(() => {
    cy.visit('/bookmarks/ckv43l07e0000w2aad139v4o1')
  })

  it('should render bookmarks list', () => {
    cy.get('[data-cy="bookmarks-list"]').should('be.visible')
    cy.get('[data-cy="bookmark-detail"]').should('be.visible')
    cy.get('[data-cy="open-add-bookmark-dialog"]').should('not.exist')
    cy.get('[data-cy="open-edit-bookmark-dialog"]').should('not.exist')
  })
})
