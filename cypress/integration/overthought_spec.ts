/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Overthought index', () => {
  before(() => {
    cy.visit('/overthought');
  });

  it('should render header', () => {
    cy.get('[data-cy="overthought"]')
      .scrollIntoView()
      .should('be.visible');
  });
});
