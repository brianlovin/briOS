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
    <Container data-cy="overthought-subscribe-box">
      <H4 style={{ marginTop: 0, display: 'flex', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', paddingRight: '16px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        </span>
        Follow along
      </H4>
      <P style={{ marginTop: 0 }}>If you want to know about new posts, add your email below. Alternatively, you can <A href="https://overthought.ghost.io/rss/" target="_blank" rel="noopener noreferrer">subscribe with RSS</A>.</P>
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