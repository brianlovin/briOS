// @flow
import * as React from 'react'
import fetch from 'isomorphic-unfetch'
import Card from '../Card'
import {
  Grid,
  CardContent,
  Org,
  Name,
  Description,
} from './style'

export const projects = [
  { 
    org: 'withspectrum', 
    name: 'spectrum', 
    description: 'Simple, powerful online communities'
  },
  { 
    org: 'specfm', 
    name: 'specfm-next', 
    description: 'Level up'
  },
  { 
    org: 'brianlovin', 
    name: 'brian-lovin-next', 
    description: 'Powering the website you’re on'
  }
]

class OpenSourceGrid extends React.Component<{}> {
  render() {
    return (
      <Grid data-cy="open-source">
        {
          projects.map(project => {
            return (
              <a key={project.name} href={`https://github.com/${project.org}/${project.name}`} target="_blank" rel="noopener noreferrer">
                <Card>
                  <CardContent>
                    <Org>{project.org}</Org>
                    <Name>{project.name}</Name>
                    <Description>{project.description}</Description>
                  </CardContent>
                </Card>
              </a>
            )
          })
        }
      </Grid>
    )
  }
}

export default OpenSourceGrid