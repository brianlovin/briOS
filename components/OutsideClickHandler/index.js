// @flow
import * as React from 'react';

type Props = {
  children: React.Node,
  onOutsideClick: Function,
  style?: Object
};

class OutsideAlerter extends React.Component<Props> {
  wrapperRef: React.Node;

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef = (node: React.Node) => {
    this.wrapperRef = node;
  };

  handleClickOutside = (event: any) => {
    // $FlowFixMe
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.onOutsideClick();
    }
  };

  render() {
    // $FlowFixMe
    return <div style={this.props.style} ref={this.setWrapperRef}>{this.props.children}</div>;
  }
}

export default OutsideAlerter;