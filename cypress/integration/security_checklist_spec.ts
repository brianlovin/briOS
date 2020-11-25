import data from '../../src/data/security'

describe('Home', () => {
  before(() => {
    cy.visit('/security')
  })

  it('should render content', () => {
    const dataKeys = Object.keys(data)
    dataKeys.map((key: string) => {
      // @ts-ignore
      cy.contains(data[key].title)
    })
  })
})
