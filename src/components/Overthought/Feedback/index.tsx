import * as React from 'react'
import { useForm } from '@statickit/react';
import { BlogPost } from '~/types';
import { PrimaryButton } from '~/components/Button'
import { H5, P } from '~/components/Typography'
import { InputGrid, Container, Form, Textarea, Input, Success, Error } from './style'

interface Props {
  post: BlogPost;
};

export default function Feedback({ post }: Props) {
  const [message, setMessage] = React.useState('')
  const [state, submit] = useForm({
    site: 'bc5db987c0ab',
    form: 'contact-form'
  });

  function onChange(e) {
    setMessage(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    submit(e)
    return setMessage('')
  }

  return (
    <Container>
      <H5 style={{ marginTop: 0, display: 'flex', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', paddingRight: '16px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </span>
        A small favor
      </H5>
      <P style={{ marginTop: 0 }}>Was anything I wrote confusing, outdated, or incorrect? Please let me know! Just write a few words below and I'll be sure to amend this post with your suggestions.</P>

      <Form onSubmit={handleSubmit}>
        <input style={{ display: 'none' }} type="text" value={post.title} id={post.title} name="title" />
        <Textarea onChange={onChange} value={message} id="message" name="message" placeholder="What should I know?"></Textarea>
        <InputGrid>
          <Input id="email" name="email" placeholder="(Optional) Email" />
          <Input id="twitter" name="twitter" placeholder="(Optional) Twitter handle" />
        </InputGrid>
        <PrimaryButton disabled={state.submitting || !message} type="submit">Send</PrimaryButton>
        {state.errors.length > 1 && <Error>{state.errors.map(e => e.message)}</Error>}
        {state.succeeded && <Success>Thanks for taking the time to leave a note!</Success>}
      </Form>
    </Container>
  )
}