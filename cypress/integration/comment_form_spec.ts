/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Comment form', () => {
  beforeEach(() => {
    cy.visit('/bookmarks/ckv43q5o11568w2aang3fmbts')
  })

  it('should render bookmarks list', () => {
    cy.get('[data-cy="bookmarks-list"]').should('be.visible')
  })

  it('should render bookmarks detail', () => {
    cy.get('[data-cy="bookmark-detail"]').should('be.visible')
  })

  it('should not render comment-form', () => {
    cy.get('[data-cy="comment-form-textarea"]').should('be.visible')
  })

  it('should render sign in dialog', () => {
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
