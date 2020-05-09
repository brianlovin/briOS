import * as React from 'react'
import { Post } from '~/graphql/types.generated'
import { PrimaryButton } from '~/components/Button'
import { H5, P } from '~/components/Typography'
import Input from '~/components/Input'
import {
  InputGrid,
  Container,
  Form,
  Textarea,
  Success,
  Error,
  Label,
} from './style'

interface Props {
  post: Post
}

export default function Feedback({ post }: Props) {
  const [message, setMessage] = React.useState('')

  const [serverState, setServerState] = React.useState({
    submitting: false,
    submitted: false,
    error: false,
  })

  function onChange(e) {
    setMessage(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    setServerState({ submitting: true, submitted: false, error: false })

    fetch('https://formspree.io/xqkeqvkq', {
      method: 'POST',
      body: new FormData(form),
      headers: {
        Accept: 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        setServerState({
          submitting: false,
          submitted: true,
          error: false,
        })
        form.reset()
        setMessage('')
      } else {
        response.json().then((data) => {
          setServerState({
            submitting: false,
            submitted: true,
            error: data.error,
          })
        })
      }
    })
  }

  return (
    <Container>
      <H5 style={{ display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingRight: '16px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </span>
        A small favor
      </H5>
      <P>
        Was anything I wrote confusing, outdated, or incorrect? Please let me
        know! Just write a few words below and I’ll be sure to amend this post
        with your suggestions.
      </P>

      <Form onSubmit={handleSubmit}>
        <input
          type="hidden"
          value={`New comment on ${post.title}`}
          id={post.title}
          name="_subject"
          readOnly
        />
        <Label>
          <span>Message</span>
          <Textarea
            onChange={onChange}
            value={message}
            id="message"
            name="message"
            placeholder="What should I know?"
          ></Textarea>
        </Label>

        <InputGrid>
          <Label>
            <span>Email</span>

            <Input
              id="feedback-email"
              name="email"
              placeholder="(Optional) Email"
            />
          </Label>
          <Label>
            <span>(Optional) Twitter handle</span>

            <Input
              id="twitter"
              name="twitter"
              placeholder="(Optional) Twitter handle"
            />
          </Label>
        </InputGrid>
        <PrimaryButton
          disabled={serverState.submitting || !message}
          type="submit"
        >
          Send
        </PrimaryButton>
        {serverState.submitted &&
          (serverState.error ? (
            <Error>{serverState.error}</Error>
          ) : (
            <Success>Thanks for taking the time to leave a note!</Success>
          ))}
      </Form>
    </Container>
  )
}
