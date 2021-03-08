/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import designDetailsPosts from '../../src/data/appDissections'

describe('Design Details', () => {
  before(() => {
    cy.visit('/app-dissection')
  })

  it('should render design details', () => {
    designDetailsPosts.map((detail) => {
      cy.contains(detail.title)
      cy.contains(`${detail.details.length} details`)
    })
  })
})
