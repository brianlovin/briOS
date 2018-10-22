// @flow
import * as React from 'react'
import Link from 'next/link'
import Card from '../Card'
import { OutlineButton } from '../Button'
import { Container, Grid, Art, Content, Title, Description } from './style'

class SpecificsGrid extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Grid>
          <Link href={'/specifics/type-scale'}>
            <a>
              <Card>
                <Art src={'/static/img/specifics/002-header.png'} alt={'Typographic Scales'} />

                <Content>
                  <Title>Typographic Scales</Title>
                  <Description>Consistent typography using simple math</Description>
                  <OutlineButton>View</OutlineButton>
                </Content>
              </Card>
            </a>
          </Link>

          <Link href={'/specifics/8-pt-grid'}>
            <a>
              <Card>
                <Art src={'/static/img/specifics/001-header.png'} alt={'8-pt Grid'} />

                <Content>
                  <Title>The 8-Point Grid</Title>
                  <Description>Using multiples of 8 to define dimensions, padding, and margin of elements</Description>
                  <OutlineButton>View</OutlineButton>
                </Content>
              </Card>
            </a>
          </Link>
        </Grid>
      </Container>
    )
  }
}

export default SpecificsGrid