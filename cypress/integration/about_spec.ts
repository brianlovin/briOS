/// <reference types="cypress" />

describe('About', () => {
  before(() => {
    cy.visit('/about');
  });

  it('should render about', () => {
    cy.contains('About me');
  });
});
