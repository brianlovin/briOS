/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { designDetailsPosts } from '../../src/data';

const slug = 'instagram-ios';
// @ts-ignore
const detail = designDetailsPosts.find(d => d.slug === slug)

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

  it('should render a media player for each detail', () => {
    cy.get('[data-cy="detail-media-container"]').should($p => {
      expect($p).to.have.length(detail.details.length);
    });
  });

  it('should render design details more to read', () => {
    designDetailsPosts.slice(0, 3).map(detail => {
      cy.contains(detail.title);
      cy.contains(`${detail.details.length} details`);
    });
  });
});
