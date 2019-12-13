import * as React from 'react'
import { PrimaryButton } from '~/components/Button'
import { A, H4, P } from '~/components/Typography'
import { Container, Input, Form, Success, Error } from './style'

export default function OverthoughtSubscribeBox() {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState('pending')
  const [errorMessage, setErrorMessage] = React.useState('')

  function onChange(e) {
    if (status !== 'pending') setStatus('pending')
    return setEmail(e.target.value.trim())
  }

  async function submit(e) {
    e.preventDefault()
    
    const res = await fetch('/api/newsletter', {
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    });

    const { error } = await res.json();

    if (error) {
      setStatus('error');
      setErrorMessage(error)
      return;
    }

    setEmail('')
    setStatus('succeeded')
  }

  return (
    <Container>
      <H4 style={{ marginTop: 0 }}>Newsletter</H4>
      <P style={{ marginTop: 0 }}>Get an email whenever I publish new posts. Your email won’t be used for anything else. Alternatively, you can <A href="https://overthought.ghost.io/rss/" target="_blank" rel="noopener noreferrer">subscribe with RSS</A>.</P>
      {
        status === "succeeded"
        ? (
          <Success>Thanks for subscribing!</Success>
        )
        : (
          <Form onSubmit={submit}>
            <Input value={email} disabled={status === "loading"} onChange={onChange} placeholder="Email address" id="email" type="email" name="email" />
            <PrimaryButton type="submit">Subscribe</PrimaryButton>
          </Form>
        )
      }
      {status === 'error' && <Error>{errorMessage}</Error>}
    </Container>
  )
}