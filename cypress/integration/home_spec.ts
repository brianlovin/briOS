/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { designDetailsPosts } from '../../src/data';

describe('Home', () => {
  before(() => {
    cy.visit('/');
  });

  it('should render design details', () => {
    designDetailsPosts.map(detail => {
      cy.contains(detail.title);
    });
  });

  it('should render overthought', () => {
    cy.contains('Overthought')
      .scrollIntoView()
      .should('be.visible');
  });

  it('should render podcast player', () => {
    cy.get('[data-cy="design-details-player"]')
      .scrollIntoView()
      .should('be.visible');

    cy.get(`[href="https://designdetails.fm"]`).should(
      'be.visible'
    );
  });
});
