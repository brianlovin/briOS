/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import designDetailsPosts from '../../src/data/appDissections'

describe.skip('Home', () => {
  before(() => {
    cy.visit('/')
  })

  it('should render design details', () => {
    designDetailsPosts.slice(0, 4).map((detail) => {
      cy.contains(detail.title)
    })
  })

  it('should render overthought', () => {
    cy.contains('Overthought').scrollIntoView().should('be.visible')
  })
})
