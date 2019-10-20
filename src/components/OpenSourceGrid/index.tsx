import * as React from 'react';
import Card from '../Card';
import { Grid, CardContent, Org, Name, Description } from './style';
import { oss as projects } from '../../data'

export default function OpenSourceGrid() {
  return (
    <Grid data-cy="open-source">
      {projects.map(project => (
        <a
          key={project.name}
          href={`https://github.com/${project.org}/${project.name}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Card>
            <CardContent>
              <Org>{project.org}</Org>
              <Name>{project.name}</Name>
              <Description>{project.description}</Description>
            </CardContent>
          </Card>
        </a>
      ))}
    </Grid>
  );
}
