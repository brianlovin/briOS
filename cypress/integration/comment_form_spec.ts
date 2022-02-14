/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Comment form', () => {
  beforeEach(() => {
    cy.visit('/bookmarks/ckv43l07e0000w2aad139v4o1')
  })

  it('should render bookmarks list', () => {
    cy.get('[data-cy="bookmarks-list"]').should('be.visible')
    cy.get('[data-cy="bookmark-detail"]').should('be.visible')
    cy.get('[data-cy="comment-form-textarea"]').should('be.visible')
    cy.get('[data-cy="comment-form-textarea"]').focus().type('Typing a comment')
    cy.get('[data-cy="submit-comment-button"]').click()
    cy.get('[data-cy="sign-in-dialog"]').should('be.visible')
  })

  it('should save message to localstorage', () => {
    cy.get('[data-cy="comment-form-textarea"]').focus().type('Typing a comment')
    cy.get('[data-cy="submit-comment-button"]').click()
    cy.get('[data-cy="sign-in-dialog"]').should('be.visible')
    cy.reload()
    cy.get('[data-cy="comment-form-textarea"]').should(
      'contain.value',
      'Typing a comment'
    )
  })
})
