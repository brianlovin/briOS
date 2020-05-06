import * as React from 'react'
import styled from 'styled-components'

interface Props {
  gap?: number
  columns?: string
  as?: string | React.ReactElement
  style?: object
  children: React.ReactElement[] | React.ReactElement | any
  [propName: string]: {}
}

function px(number) {
  return `${number}px`
}

const GridContainer = styled.div`
  display: grid;
  width: 100%;
  gap: ${(props) => px(props.gap)};
  grid-template-columns: ${(props) => props.columns};
`

export default function Grid(props: Props) {
  const { gap = 0, columns = '1fr' } = props
  return <GridContainer gap={gap} columns={columns} {...props} />
}
