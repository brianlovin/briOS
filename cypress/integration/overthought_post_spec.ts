/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Posts index', () => {
  it('should render post', () => {
    cy.visit('/writing/adding-dark-mode-with-next-js')
    cy.get('[data-cy="post"]').scrollIntoView().should('be.visible')
  })

  it('should render 404', () => {
    cy.visit('/writing/foobar')
    cy.wait(1000)
    cy.get('[data-cy="post-not-found"]').scrollIntoView().should('be.visible')
  })

  it('should render newsletter', () => {
    cy.visit('/writing/adding-dark-mode-with-next-js')
    cy.get('[data-cy="writing-feedback-box"]')
      .scrollIntoView()
      .should('be.visible')
    cy.get('[data-cy="writing-subscribe-box"]')
      .scrollIntoView()
      .should('be.visible')
  })
})
