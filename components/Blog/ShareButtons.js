// @flow
import * as React from 'react';
import {
  ButtonRow,
  FacebookButton,
  TwitterButton,
  CopyLinkButton,
} from '../Button';
import { ShareButtonsContainer } from './style';

type Props = {
  url: string,
  text: string,
};

class BlogShareButtons extends React.Component<Props> {
  render() {
    const { url, text } = this.props;

    return (
      <ShareButtonsContainer>
        <ButtonRow>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookButton>Share</FacebookButton>
          </a>

          <a
            href={`https://twitter.com/share?text=${text} on @specfm&url=${url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterButton>Tweet</TwitterButton>
          </a>

          <CopyLinkButton text={url}>Copy</CopyLinkButton>
        </ButtonRow>
      </ShareButtonsContainer>
    );
  }
}

export default BlogShareButtons;
