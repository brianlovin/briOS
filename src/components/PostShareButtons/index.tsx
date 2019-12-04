 
import * as React from 'react';
import { FacebookButton, TwitterButton, CopyLinkButton } from '../Button';
import { Container } from './style';

interface Props {
  route: string;
  title: string;
};

export default function PostShareButtons(props: Props) {
  const { route, title } = props;

  return (
    <Container>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=https://brianlovin.com/${route}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FacebookButton>Share</FacebookButton>
      </a>

      <a
        href={`https://twitter.com/share?text=${title} by @brian_lovin&url=https://brianlovin.com/${route}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <TwitterButton>Tweet</TwitterButton>
      </a>

      <CopyLinkButton
        text={`https://brianlovin.com/${route}`}
      >
        Copy
      </CopyLinkButton>
    </Container>
  );
}
