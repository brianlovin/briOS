import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 128px;
  padding: 0 16px;
  margin-bottom: ${props => (props.addPlayerPadding ? '196px' : '0')};
  width: 100%;
`;

export const Description = styled.p`
  font-size: 14px;
  color: ${props => props.theme.text.tertiary};
  max-width: 320px;
  display: flex;
  flex: 1 0 auto;
  align-items: flex-start;
  padding-bottom: 16px;
  font-weight: 600;

  a {
    color: ${props => props.theme.text.default};
    margin-left: 4px;
  }
`;

export const Icons = styled.div`
  display: flex;
  flex: 1 0 auto;
  align-items: flex-start;
  margin-left: -16px;
  padding-bottom: 8px;

  a {
    color: ${props => props.theme.text.tertiary};
  }

  a:hover {
    color: ${props => props.theme.text.default};
  }

  .icon {
    margin-left: 16px;
  }
`;
