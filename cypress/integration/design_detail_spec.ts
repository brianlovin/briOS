/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import designDetailsPosts from '../../src/data/appDissections'

const slug = 'instagram-ios'
// @ts-ignore
const detail = designDetailsPosts.find((d) => d.slug === slug)

describe('Design Detail Post', () => {
  before(() => {
    cy.visit(`/design-details/${slug}`)
  })

  it('should render design detail header', () => {
    cy.contains(detail.title)
    cy.contains(`${detail.details.length} details`)
  })

  it('should render a media player for each detail', () => {
    cy.get('[data-cy="detail-media-container"]').should(($p) => {
      expect($p).to.have.length(detail.details.length)
    })
  })
})
