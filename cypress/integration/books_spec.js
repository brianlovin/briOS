import { books } from '../../config' 

describe('Books', () => {
  before(() => {
    cy.visit('/');
  })

  it('should render books', () => {
    cy.get('[data-cy="books"]')
      .scrollIntoView()
      .should('be.visible')

    books.map(book => {
      cy.get(`[href="${book.url}"]`).should('be.visible')
    })
  })
});
