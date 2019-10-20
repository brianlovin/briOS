/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { designDetails } from '../../src/data';

describe('Design Details', () => {
  before(() => {
    cy.visit('/design-details');
  });

  it('should render design details', () => {
    designDetails.map(detail => {
      cy.contains(detail.title);
      cy.contains(`${detail.details.length} details`);
    });
  });
});
