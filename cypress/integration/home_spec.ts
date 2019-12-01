/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { designDetails } from '../../src/data';

describe('Home', () => {
  before(() => {
    cy.visit('/');
  });

  it('should render design details', () => {
    designDetails.map(detail => {
      cy.contains(detail.title);
    });
  });

  it('should render podcast player', () => {
    cy.get('[data-cy="design-details-player"]')
      .scrollIntoView()
      .should('be.visible');

    cy.get(`[href="https://designdetails.fm"]`).should(
      'be.visible'
    );
  });

  it('should render footer', () => {
    cy.get('[data-cy="footer"]')
      .scrollIntoView()
      .should('be.visible');

    cy.get(`[href="https://twitter.com/brian_lovin"]`).should('be.visible');
    cy.get(`[href="https://github.com/brianlovin/brian-lovin-next"]`).should(
      'be.visible'
    );
  });
});
