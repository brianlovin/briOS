// @flow
import * as React from 'react';
import * as Styled from '../style';

type Props = {
  children: React.Node,
};

type CustomProps = {
  ...$Exact<Props>,
  color: string,
};

export class CustomNotice extends React.Component<CustomProps> {
  static Title = Styled.CustomNoticeTitle;

  static Description = Styled.CustomNoticeDescription;

  render() {
    const { children, color } = this.props;
    return <Styled.CustomNotice color={color}>{children}</Styled.CustomNotice>;
  }
}
