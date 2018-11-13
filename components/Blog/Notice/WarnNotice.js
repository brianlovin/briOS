// @flow
import * as React from 'react';
import * as Styled from '../style';

type Props = {
  children: React.Node,
};

export class WarnNotice extends React.Component<Props> {
  static Title = Styled.WarnNoticeTitle;

  static Description = Styled.WarnNoticeDescription;

  render() {
    const { children } = this.props;
    return <Styled.WarnNotice>{children}</Styled.WarnNotice>;
  }
}
