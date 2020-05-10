import * as React from 'react'
import Input from '~/components/Input'

export default function Textarea(props) {
  const textInput = React.useRef(null)

  function handleKeyDown(e) {
    textInput.current.style.height = 'inherit'
    textInput.current.style.height = `${e.target.scrollHeight}px`
  }

  return (
    <Input as="textarea" onKeyDown={handleKeyDown} ref={textInput} {...props} />
  )
}
