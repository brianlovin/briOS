/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Writing detail', () => {
  before(() => {
    cy.visit(
      '/writing/what-ive-learned-so-far-about-design-advising-and-angel-investing'
    )
  })

  it('should render posts list', () => {
    cy.get('[data-cy="posts-list"]').should('be.visible')
    cy.get('[data-cy="post-detail"]').should('be.visible')
  })
})
