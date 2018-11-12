import { projects as repos } from '../../components/OpenSourceGrid'

describe('OSS', () => {
  before(() => {
    cy.visit('/oss');
  })

  it('should render open source projects', () => {
    cy.get('[data-cy="open-source"]')
      .scrollIntoView()
      .should('be.visible')

    repos.map(repo => {
      cy.contains(repo.description)
      cy.get(`[href="https://github.com/${repo.org}/${repo.name}"]`)
        .should('be.visible')
    })
  })
});
