/// <reference types="cypress" />

import designDetails from '../../src/data/designDetails';

console.log({ designDetails })

const slug = 'instagram-ios';
// @ts-ignore
const detail = designDetails.find(d => d.slug === slug)

describe('Design Detail Post', () => {
  before(() => {
    cy.visit(`/design-details/${slug}`);
  });

  it('should render design detail header', () => {
    cy.contains(detail.title);
    cy.contains(`${detail.details.length} details`);
  });

  it('should render share links', () => {
    cy.get(
      `[href="https://www.facebook.com/sharer/sharer.php?u=https://brianlovin.com/design-details/${slug}"]`
    ).should('be.visible');

    cy.get(
      `[href="https://twitter.com/share?text=Design Details: Instagram by @brian_lovin&url=https://brianlovin.com/design-details/${slug}"]`
    ).should('be.visible');

    cy.get('[data-cy="copy-link-button"]').should('be.visible');
  });

  it('should render podcast player', () => {
    cy.get('[data-cy="design-details-player"]').should($p => {
      expect($p).to.have.length(2);
    });

    cy.get('[data-cy="design-details-player"]')
      .first()
      .scrollIntoView()
      .should('be.visible');
  });

  it('should render a media player for each detail', () => {
    cy.get('[data-cy="detail-media-container"]').should($p => {
      expect($p).to.have.length(detail.details.length);
    });
  });

  it('should render design details more to read', () => {
    designDetails.map(detail => {
      cy.contains(detail.title);
      cy.contains(`${detail.details.length} details`);
    });
  });
});
