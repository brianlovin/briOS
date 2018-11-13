// @flow
import * as React from 'react';
import * as Styled from '../style';

type Props = {
  children: React.Node,
};

export class Notice extends React.Component<Props> {
  static Title = Styled.NoticeTitle;

  static Description = Styled.NoticeDescription;

  render() {
    const { children } = this.props;
    return <Styled.Notice>{children}</Styled.Notice>;
  }
}
