import { music } from '../../config' 

describe('Music', () => {
  before(() => {
    cy.visit('/music');
  })

  it('should render music', () => {
    cy.get('[data-cy="music"]')
      .scrollIntoView()
      .should('be.visible')

    music.map(album => {
      cy.get(`[href="${album.url}"]`).should('be.visible')
    })
  })
});
