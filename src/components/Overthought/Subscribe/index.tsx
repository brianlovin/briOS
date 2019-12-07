import * as React from 'react'
import { useForm } from '@statickit/react';
import { PrimaryButton } from '~/components/Button'
import { A, H4, P } from '~/components/Typography'
import { Container, Input, Form, Success } from './style'

export default function OverthoughtSubscribeBox() {
  const [state, submit] = useForm({
    site: '101ff4c55a85',
    form: 'overthought'
  });

  return (
    <Container>
      <H4 style={{ marginTop: 0 }}>Newsletter</H4>
      <P style={{ marginTop: 0 }}>Get an email whenever I publish new posts. Your email won’t be used for anything else. Alternatively, you can <A href="https://overthought.ghost.io/rss/" target="_blank" rel="noopener noreferrer">subscribe with RSS</A>.</P>
      {
        state.succeeded
        ? (
          <Success>Thanks for subscribing!</Success>
        )
        : (
          <Form onSubmit={submit}>
          <Input placeholder="Email address" id="email" type="email" name="email" />
          <PrimaryButton type="submit">Subscribe</PrimaryButton>
        </Form>
        )
      }
    </Container>
  )
}