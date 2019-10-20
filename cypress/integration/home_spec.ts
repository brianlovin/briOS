/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { designDetails, books, music, oss as repos } from '../../src/data';

describe('Home', () => {
  before(() => {
    cy.visit('/');
  });

  it('should render design details', () => {
    designDetails.slice(0, 4).map(detail => {
      cy.contains(detail.title);
    });
  });

  it('should render link to view all design details', () => {
    cy.contains(`View all ${designDetails.length} exploration`);
    cy.get('[data-cy="view-all-design-details"]').should('be.visible');
  });

  it('should render podcast player', () => {
    cy.get('[data-cy="design-details-player"]')
      .scrollIntoView()
      .should('be.visible');

    cy.get(`[href="https://spec.fm/podcasts/design-details"]`).should(
      'be.visible'
    );
  });

  it('should render open source projects', () => {
    cy.get('[data-cy="open-source"]')
      .scrollIntoView()
      .should('be.visible');

    repos.map(repo => {
      cy.contains(repo.description);
      cy.get(`[href="https://github.com/${repo.org}/${repo.name}"]`).should(
        'be.visible'
      );
    });
  });

  it('should render books', () => {
    cy.get('[data-cy="books"]')
      .scrollIntoView()
      .should('be.visible');

    books.map(book => {
      cy.get(`[href="${book.url}"]`).should('be.visible');
    });
  });

  it('should render music', () => {
    cy.get('[data-cy="music"]')
      .scrollIntoView()
      .should('be.visible');

    music.map(album => {
      cy.get(`[href="${album.url}"]`).should('be.visible');
    });
  });

  it('should render footer', () => {
    cy.get('[data-cy="footer"]')
      .scrollIntoView()
      .should('be.visible');

    cy.get(`[href="https://twitter.com/brian_lovin"]`).should('be.visible');
    cy.get(`[href="https://github.com/brianlovin/brian-lovin-next"]`).should(
      'be.visible'
    );
    cy.get(`[href="https://spectrum.chat/users/brian"]`).should('be.visible');
  });

  it('should render header', () => {
    cy.get('[data-cy="header"]')
      .scrollIntoView()
      .should('be.visible');

    cy.get(`[href="/about"]`).should('be.visible');
  });
});
