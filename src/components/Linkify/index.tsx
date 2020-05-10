import * as React from 'react'
import replace from 'string-replace-to-array'
import MakeLinks from 'react-linkify'
const MARKDOWN_LINK = /(?:\[(.*?)\]\((.*?)\))/g

function RenderTextWithMarkdownLinks(text: string) {
  return replace(text, MARKDOWN_LINK, function (_, text, url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" key={url}>
        {text}
      </a>
    )
  })
}

interface Props {
  children: string
}

export default function Linkify(props: Props) {
  return <MakeLinks>{RenderTextWithMarkdownLinks(props.children)}</MakeLinks>
}
